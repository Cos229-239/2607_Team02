package com.flameborne.echiron.data

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.flameborne.echiron.model.DayKey
import com.flameborne.echiron.model.EchironState
import com.flameborne.echiron.model.EchironTask
import com.flameborne.echiron.model.Encouragement
import com.flameborne.echiron.model.EncouragementContext
import com.flameborne.echiron.model.EncouragementDraft
import com.flameborne.echiron.model.EncouragementEngine
import com.flameborne.echiron.model.EncouragementLength
import com.flameborne.echiron.model.EncouragementPreferences
import com.flameborne.echiron.model.EncouragementSignal
import com.flameborne.echiron.model.EncouragementTone
import com.flameborne.echiron.model.Priority
import com.flameborne.echiron.model.UserProfile
import java.io.IOException
import java.time.Instant
import java.util.UUID
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import org.json.JSONArray
import org.json.JSONObject

private val Context.echironDataStore by preferencesDataStore(name = "echiron_native")

class EchironRepository(private val context: Context) {
    private object Keys {
        val preferredName = stringPreferencesKey("preferred_name")
        val onboardingComplete = booleanPreferencesKey("onboarding_complete")
        val tasks = stringPreferencesKey("tasks_json")
        val focusMinutes = intPreferencesKey("focus_minutes")
        val focusSessions = intPreferencesKey("focus_sessions")
        val encouragement = stringPreferencesKey("encouragement_json")
        val encouragementTone = stringPreferencesKey("encouragement_tone")
        val encouragementLength = stringPreferencesKey("encouragement_length")
        val spiritualEnabled = booleanPreferencesKey("spiritual_encouragement_enabled")
        val pinnedPrinciples = stringPreferencesKey("pinned_encouragement_principles")
    }

    val state: Flow<EchironState> =
        context.echironDataStore.data
            .catch { exception ->
                if (exception is IOException) emit(emptyPreferences()) else throw exception
            }.map(::preferencesToState)

    suspend fun saveProfile(preferredName: String) {
        val cleanName = preferredName.trim().ifBlank { "Friend" }
        context.echironDataStore.edit { preferences ->
            preferences[Keys.preferredName] = cleanName
            preferences[Keys.onboardingComplete] = true
        }
    }

    suspend fun addTask(task: EchironTask) {
        context.echironDataStore.edit { preferences ->
            val tasks = decodeTasks(preferences[Keys.tasks]).toMutableList()
            tasks.add(task)
            preferences[Keys.tasks] = encodeTasks(tasks)
        }
    }

    suspend fun upsertTask(task: EchironTask) {
        context.echironDataStore.edit { preferences ->
            val tasks = decodeTasks(preferences[Keys.tasks]).toMutableList()
            val existingIndex = tasks.indexOfFirst { it.id == task.id }
            if (existingIndex >= 0) {
                val existing = tasks[existingIndex]
                tasks[existingIndex] = task.copy(
                    completed = existing.completed,
                    completedAt = existing.completedAt,
                )
            } else {
                tasks.add(task)
            }
            preferences[Keys.tasks] = encodeTasks(tasks)
        }
    }

    suspend fun toggleTask(taskId: String) {
        context.echironDataStore.edit { preferences ->
            val tasks = decodeTasks(preferences[Keys.tasks]).toMutableList()
            val index = tasks.indexOfFirst { it.id == taskId }
            if (index < 0) return@edit
            val original = tasks[index]
            val nowCompleted = !original.completed
            val completedAt = Instant.now().toString()
            val updated =
                original.copy(
                    completed = nowCompleted,
                    completedAt = if (nowCompleted) completedAt else null,
                )
            tasks[index] = updated
            preferences[Keys.tasks] = encodeTasks(tasks)

            if (nowCompleted) {
                val history = decodeEncouragement(preferences[Keys.encouragement])
                val draft =
                    EncouragementEngine.forCompletedTask(
                        task = updated,
                        profile = profileFrom(preferences),
                        history = history,
                        preferences = encouragementPreferencesFrom(preferences),
                        completedAt = completedAt,
                    )
                val record = draft.toRecord(updated, completedAt)
                preferences[Keys.encouragement] = encodeEncouragement(listOf(record) + history.take(299))
            }
        }
    }

    suspend fun deleteTask(taskId: String) {
        context.echironDataStore.edit { preferences ->
            preferences[Keys.tasks] = encodeTasks(decodeTasks(preferences[Keys.tasks]).filterNot { it.id == taskId })
        }
    }

    suspend fun recordFocusSession(minutes: Int) {
        require(minutes > 0)
        context.echironDataStore.edit { preferences ->
            preferences[Keys.focusMinutes] = (preferences[Keys.focusMinutes] ?: 0) + minutes
            preferences[Keys.focusSessions] = (preferences[Keys.focusSessions] ?: 0) + 1
            val now = Instant.now().toString()
            val sourceId = UUID.randomUUID().toString()
            val history = decodeEncouragement(preferences[Keys.encouragement])
            val draft =
                EncouragementEngine.forFocusSession(
                    sourceId = sourceId,
                    minutes = minutes,
                    profile = profileFrom(preferences),
                    history = history,
                    preferences = encouragementPreferencesFrom(preferences),
                    completedAt = now,
                )
            val record =
                draft.toRecord(
                    EchironTask(
                        id = sourceId,
                        title = "$minutes-minute focus block",
                        details = "A protected block of focused, distraction-limited work.",
                        category = "Focus",
                        createdAt = now,
                        completed = true,
                        completedAt = now,
                    ),
                    now,
                )
            preferences[Keys.encouragement] = encodeEncouragement(listOf(record) + history.take(299))
        }
    }

    suspend fun toggleSavedEncouragement(recordId: String) {
        updateEncouragement(recordId) { it.copy(saved = !it.saved, dismissed = false) }
    }

    suspend fun dismissEncouragement(recordId: String) {
        updateEncouragement(recordId) { it.copy(saved = false, dismissed = true) }
    }

    suspend fun requestAnotherEncouragement(recordId: String) {
        context.echironDataStore.edit { preferences ->
            val history = decodeEncouragement(preferences[Keys.encouragement])
            val record = history.firstOrNull { it.id == recordId } ?: return@edit
            val subject =
                EchironTask(
                    id = record.sourceId,
                    title = record.subjectTitle,
                    details = record.subjectDetails,
                    category = record.subjectCategory,
                    priority = record.subjectPriority,
                    createdAt = record.subjectCreatedAt,
                    completed = true,
                    completedAt = record.createdAt,
                )
            val draft =
                EncouragementEngine.forCompletedTask(
                    task = subject,
                    profile = profileFrom(preferences),
                    history = history,
                    preferences = encouragementPreferencesFrom(preferences),
                    completedAt = record.createdAt,
                    excludedMessageIds = setOf(record.messageId),
                )
            val replacement = draft.toRecord(subject, record.createdAt).copy(id = record.id)
            preferences[Keys.encouragement] =
                encodeEncouragement(history.map { if (it.id == recordId) replacement else it })
        }
    }

    suspend fun updateEncouragementPreferences(preferences: EncouragementPreferences) {
        context.echironDataStore.edit { values ->
            values[Keys.encouragementTone] = preferences.tone.name
            values[Keys.encouragementLength] = preferences.length.name
            values[Keys.spiritualEnabled] = preferences.spiritualEnabled
            values[Keys.pinnedPrinciples] = JSONArray(preferences.pinnedPrincipleIds.toList()).toString()
        }
    }

    private suspend fun updateEncouragement(
        recordId: String,
        transform: (Encouragement) -> Encouragement,
    ) {
        context.echironDataStore.edit { preferences ->
            val history = decodeEncouragement(preferences[Keys.encouragement])
            preferences[Keys.encouragement] =
                encodeEncouragement(history.map { if (it.id == recordId) transform(it) else it })
        }
    }

    private fun preferencesToState(preferences: Preferences): EchironState =
        EchironState(
            profile = profileFrom(preferences),
            onboardingComplete = preferences[Keys.onboardingComplete] ?: false,
            tasks = decodeTasks(preferences[Keys.tasks]),
            focusMinutes = preferences[Keys.focusMinutes] ?: 0,
            focusSessions = preferences[Keys.focusSessions] ?: 0,
            encouragementPreferences = encouragementPreferencesFrom(preferences),
            encouragementHistory = decodeEncouragement(preferences[Keys.encouragement]),
        )

    private fun profileFrom(preferences: Preferences) =
        UserProfile(preferredName = preferences[Keys.preferredName].orEmpty())

    private fun encouragementPreferencesFrom(preferences: Preferences) =
        EncouragementPreferences(
            tone = enumOrDefault(preferences[Keys.encouragementTone].orEmpty(), EncouragementTone.BALANCED),
            length = enumOrDefault(preferences[Keys.encouragementLength].orEmpty(), EncouragementLength.BRIEF),
            spiritualEnabled = preferences[Keys.spiritualEnabled] ?: false,
            pinnedPrincipleIds = decodeStringSet(preferences[Keys.pinnedPrinciples]),
        )

    private fun EncouragementDraft.toRecord(task: EchironTask, createdAt: String) =
        Encouragement(
            id = UUID.randomUUID().toString(),
            sourceId = task.id,
            subjectTitle = task.title,
            subjectDetails = task.details,
            subjectCategory = task.category,
            subjectPriority = task.priority,
            subjectCreatedAt = task.createdAt,
            context = context,
            secondaryContext = secondaryContext,
            principleId = principleId,
            principleTitle = principleTitle,
            principleSource = principleSource,
            principleSourceId = principleSourceId,
            matchedSignals = matchedSignals,
            messageId = messageId,
            heading = heading,
            message = message,
            createdAt = createdAt,
        )

    private fun encodeTasks(tasks: List<EchironTask>): String =
        JSONArray().apply {
            tasks.forEach { task ->
                put(
                    JSONObject().apply {
                        put("id", task.id)
                        put("title", task.title)
                        put("details", task.details)
                        put("category", task.category)
                        put("priority", task.priority.name)
                        put("dueDay", task.dueDay?.name ?: JSONObject.NULL)
                        put("completed", task.completed)
                        put("createdAt", task.createdAt)
                        put("completedAt", task.completedAt ?: JSONObject.NULL)
                    },
                )
            }
        }.toString()

    private fun decodeTasks(raw: String?): List<EchironTask> =
        runCatching {
            val array = JSONArray(raw ?: "[]")
            buildList {
                for (index in 0 until array.length()) {
                    val item = array.getJSONObject(index)
                    add(
                        EchironTask(
                            id = item.getString("id"),
                            title = item.getString("title"),
                            details = item.optString("details"),
                            category = item.optString("category", "General"),
                            priority = enumOrDefault(item.optString("priority"), Priority.MEDIUM),
                            dueDay = item.optString("dueDay").takeIf { it.isNotBlank() && it != "null" }?.let { enumOrNull<DayKey>(it) },
                            completed = item.optBoolean("completed"),
                            createdAt = item.optString("createdAt", Instant.EPOCH.toString()),
                            completedAt = item.optString("completedAt").takeIf { it.isNotBlank() && it != "null" },
                        ),
                    )
                }
            }
        }.getOrDefault(emptyList())

    private fun encodeEncouragement(history: List<Encouragement>): String =
        JSONArray().apply {
            history.forEach { record ->
                put(
                    JSONObject().apply {
                        put("id", record.id)
                        put("sourceId", record.sourceId)
                        put("subjectTitle", record.subjectTitle)
                        put("subjectDetails", record.subjectDetails)
                        put("subjectCategory", record.subjectCategory)
                        put("subjectPriority", record.subjectPriority.name)
                        put("subjectCreatedAt", record.subjectCreatedAt)
                        put("context", record.context.name)
                        put("secondaryContext", record.secondaryContext?.name ?: JSONObject.NULL)
                        put("principleId", record.principleId)
                        put("principleTitle", record.principleTitle)
                        put("principleSource", record.principleSource)
                        put("principleSourceId", record.principleSourceId)
                        put("matchedSignals", JSONArray(record.matchedSignals.map { it.name }))
                        put("messageId", record.messageId)
                        put("heading", record.heading)
                        put("message", record.message)
                        put("createdAt", record.createdAt)
                        put("saved", record.saved)
                        put("dismissed", record.dismissed)
                    },
                )
            }
        }.toString()

    private fun decodeEncouragement(raw: String?): List<Encouragement> =
        runCatching {
            val array = JSONArray(raw ?: "[]")
            buildList {
                for (index in 0 until array.length()) {
                    val item = array.getJSONObject(index)
                    val id = item.getString("id")
                    add(
                        Encouragement(
                            id = id,
                            sourceId = item.optString("sourceId"),
                            subjectTitle = item.optString("subjectTitle"),
                            subjectDetails = item.optString("subjectDetails"),
                            subjectCategory = item.optString("subjectCategory", "General"),
                            subjectPriority = enumOrDefault(item.optString("subjectPriority"), Priority.MEDIUM),
                            subjectCreatedAt = item.optString("subjectCreatedAt"),
                            context = enumOrDefault(item.optString("context"), EncouragementContext.GENERAL),
                            secondaryContext = item.optString("secondaryContext").takeIf { it.isNotBlank() && it != "null" }?.let { enumOrNull<EncouragementContext>(it) },
                            principleId = item.optString("principleId", "legacy"),
                            principleTitle = item.optString("principleTitle", item.optString("heading", "Progress without punishment")),
                            principleSource = item.optString("principleSource", "Echiron synthesis"),
                            principleSourceId = item.optString("principleSourceId", "echiron"),
                            matchedSignals = decodeEnumSet(item.optJSONArray("matchedSignals")),
                            messageId = item.optString("messageId", id),
                            heading = item.getString("heading"),
                            message = item.getString("message"),
                            createdAt = item.optString("createdAt", Instant.EPOCH.toString()),
                            saved = item.optBoolean("saved"),
                            dismissed = item.optBoolean("dismissed"),
                        ),
                    )
                }
            }
        }.getOrDefault(emptyList())

    private fun decodeStringSet(raw: String?): Set<String> =
        runCatching {
            val array = JSONArray(raw ?: "[]")
            buildSet { for (index in 0 until array.length()) add(array.getString(index)) }
        }.getOrDefault(emptySet())

    private inline fun <reified T : Enum<T>> decodeEnumSet(array: JSONArray?): Set<T> =
        buildSet {
            if (array != null) {
                for (index in 0 until array.length()) enumOrNull<T>(array.optString(index))?.let(::add)
            }
        }

    private inline fun <reified T : Enum<T>> enumOrNull(value: String): T? =
        enumValues<T>().firstOrNull { it.name == value }

    private inline fun <reified T : Enum<T>> enumOrDefault(value: String, fallback: T): T =
        enumOrNull<T>(value) ?: fallback
}
