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
import com.flameborne.echiron.model.EncouragementEngine
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
    }

    val state: Flow<EchironState> =
        context.echironDataStore.data
            .catch { exception ->
                if (exception is IOException) {
                    emit(emptyPreferences())
                } else {
                    throw exception
                }
            }
            .map(::preferencesToState)

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

    suspend fun toggleTask(taskId: String) {
        context.echironDataStore.edit { preferences ->
            val tasks = decodeTasks(preferences[Keys.tasks]).toMutableList()
            val index = tasks.indexOfFirst { it.id == taskId }
            if (index < 0) return@edit

            val original = tasks[index]
            val nowCompleted = !original.completed
            val updated =
                original.copy(
                    completed = nowCompleted,
                    completedAt = if (nowCompleted) Instant.now().toString() else null,
                )
            tasks[index] = updated
            preferences[Keys.tasks] = encodeTasks(tasks)

            if (nowCompleted) {
                val (heading, message) = EncouragementEngine.forCompletedTask(updated)
                val history = decodeEncouragement(preferences[Keys.encouragement]).toMutableList()
                history.add(
                    0,
                    Encouragement(
                        id = UUID.randomUUID().toString(),
                        heading = heading,
                        message = message,
                        createdAt = Instant.now().toString(),
                    ),
                )
                preferences[Keys.encouragement] = encodeEncouragement(history.take(25))
            }
        }
    }

    suspend fun deleteTask(taskId: String) {
        context.echironDataStore.edit { preferences ->
            val remaining = decodeTasks(preferences[Keys.tasks]).filterNot { it.id == taskId }
            preferences[Keys.tasks] = encodeTasks(remaining)
        }
    }

    suspend fun recordFocusSession(minutes: Int) {
        require(minutes > 0)
        context.echironDataStore.edit { preferences ->
            preferences[Keys.focusMinutes] = (preferences[Keys.focusMinutes] ?: 0) + minutes
            preferences[Keys.focusSessions] = (preferences[Keys.focusSessions] ?: 0) + 1

            val (heading, message) = EncouragementEngine.forFocusSession(minutes)
            val history = decodeEncouragement(preferences[Keys.encouragement]).toMutableList()
            history.add(
                0,
                Encouragement(
                    id = UUID.randomUUID().toString(),
                    heading = heading,
                    message = message,
                    createdAt = Instant.now().toString(),
                ),
            )
            preferences[Keys.encouragement] = encodeEncouragement(history.take(25))
        }
    }

    private fun preferencesToState(preferences: Preferences): EchironState =
        EchironState(
            profile = UserProfile(preferredName = preferences[Keys.preferredName].orEmpty()),
            onboardingComplete = preferences[Keys.onboardingComplete] ?: false,
            tasks = decodeTasks(preferences[Keys.tasks]),
            focusMinutes = preferences[Keys.focusMinutes] ?: 0,
            focusSessions = preferences[Keys.focusSessions] ?: 0,
            encouragementHistory = decodeEncouragement(preferences[Keys.encouragement]),
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
                            dueDay =
                                item.optString("dueDay")
                                    .takeIf { it.isNotBlank() && it != "null" }
                                    ?.let { enumOrNull<DayKey>(it) },
                            completed = item.optBoolean("completed"),
                            createdAt = item.optString("createdAt", Instant.EPOCH.toString()),
                            completedAt =
                                item.optString("completedAt")
                                    .takeIf { it.isNotBlank() && it != "null" },
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
                        put("heading", record.heading)
                        put("message", record.message)
                        put("createdAt", record.createdAt)
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
                    add(
                        Encouragement(
                            id = item.getString("id"),
                            heading = item.getString("heading"),
                            message = item.getString("message"),
                            createdAt = item.optString("createdAt", Instant.EPOCH.toString()),
                        ),
                    )
                }
            }
        }.getOrDefault(emptyList())

    private inline fun <reified T : Enum<T>> enumOrNull(value: String): T? =
        enumValues<T>().firstOrNull { it.name == value }

    private inline fun <reified T : Enum<T>> enumOrDefault(value: String, fallback: T): T =
        enumOrNull<T>(value) ?: fallback
}
