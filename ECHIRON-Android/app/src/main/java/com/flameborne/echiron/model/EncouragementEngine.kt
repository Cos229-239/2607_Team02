package com.flameborne.echiron.model

import java.time.Instant
import java.time.ZoneId
import kotlin.math.exp
import kotlin.math.max
import kotlin.math.min

data class CompletionSubject(
    val sourceId: String,
    val title: String,
    val details: String,
    val category: String,
    val priority: Priority,
    val createdAt: String,
    val focusSession: Boolean = false,
)

data class EncouragementDraft(
    val context: EncouragementContext,
    val secondaryContext: EncouragementContext?,
    val principleId: String,
    val principleTitle: String,
    val principleSource: String,
    val principleSourceId: String,
    val matchedSignals: Set<EncouragementSignal>,
    val messageId: String,
    val heading: String,
    val message: String,
)

private data class ContextMatch(
    val primary: EncouragementContext,
    val secondary: EncouragementContext?,
    val scores: Map<EncouragementContext, Double>,
)

private data class ScoredPrinciple(
    val principle: EncouragementPrinciple,
    val score: Double,
)

private data class Composition(
    val message: String,
    val messageId: String,
)

object EncouragementEngine {
    private val stopWords =
        setOf(
            "about", "after", "again", "also", "and", "are", "because", "been", "being",
            "but", "can", "could", "did", "does", "for", "from", "had", "has", "have",
            "into", "its", "more", "not", "only", "that", "the", "their", "them", "then",
            "there", "these", "they", "this", "through", "too", "was", "were", "what",
            "when", "where", "which", "while", "will", "with", "would", "your",
        )
    private val uncertainKeywords =
        listOf("afraid", "anxious", "avoid", "conflict", "decide", "difficult", "doubt", "fear", "finally", "hard", "maybe", "nervous", "stuck", "unsure", "worry")
    private val restorativeKeywords =
        listOf("break", "doctor", "exercise", "heal", "health", "meal", "medication", "pause", "recover", "rest", "sleep", "stretch", "walk", "water", "workout")
    private val foundationKeywords =
        listOf("budget", "calendar", "clean", "foundation", "maintenance", "organize", "plan", "prepare", "schedule", "setup", "system", "tax")
    private val sharedKeywords =
        listOf("care", "child", "client", "community", "family", "friend", "help", "neighbor", "partner", "support", "team", "together", "volunteer")
    private val practiceKeywords =
        listOf("again", "daily", "habit", "practice", "repeat", "routine", "session", "weekly")

    fun forCompletedTask(
        task: EchironTask,
        profile: UserProfile,
        history: List<Encouragement>,
        preferences: EncouragementPreferences,
        completedAt: String,
        excludedMessageIds: Set<String> = emptySet(),
    ): EncouragementDraft =
        generate(
            subject =
                CompletionSubject(
                    sourceId = task.id,
                    title = task.title,
                    details = task.details,
                    category = task.category,
                    priority = task.priority,
                    createdAt = task.createdAt,
                ),
            profile = profile,
            history = history,
            preferences = preferences,
            completedAt = completedAt,
            excludedMessageIds = excludedMessageIds,
        )

    fun forFocusSession(
        sourceId: String,
        minutes: Int,
        profile: UserProfile,
        history: List<Encouragement>,
        preferences: EncouragementPreferences,
        completedAt: String,
        excludedMessageIds: Set<String> = emptySet(),
    ): EncouragementDraft =
        generate(
            subject =
                CompletionSubject(
                    sourceId = sourceId,
                    title = "$minutes-minute focus block",
                    details = "A protected block of focused, distraction-limited work.",
                    category = "Focus",
                    priority = Priority.MEDIUM,
                    createdAt = completedAt,
                    focusSession = true,
                ),
            profile = profile,
            history = history,
            preferences = preferences,
            completedAt = completedAt,
            excludedMessageIds = excludedMessageIds,
        )

    fun generate(
        subject: CompletionSubject,
        profile: UserProfile,
        history: List<Encouragement>,
        preferences: EncouragementPreferences,
        completedAt: String,
        excludedMessageIds: Set<String> = emptySet(),
    ): EncouragementDraft {
        val contexts = classifyContexts(subject, profile)
        val signals = deriveSignals(subject, contexts, history, profile, completedAt)
        val subjectText =
            normalize("${subject.title} ${subject.details} ${subject.category} ${profile.goals} ${profile.role}")
        val allowed = EncouragementCatalog.principles.filter { preferences.spiritualEnabled || !it.spiritual }
        require(allowed.isNotEmpty()) { "The encouragement catalog must contain an enabled principle." }
        val seed =
            hashString(
                "${subject.sourceId}:$completedAt:${preferences.tone}:${preferences.length}:${history.size}:${excludedMessageIds.sorted().joinToString("|")}",
            )
        val scored =
            allowed
                .map {
                    ScoredPrinciple(
                        it,
                        scorePrinciple(it, contexts, signals, subjectText, history, preferences, seed),
                    )
                }
                .sortedByDescending { it.score }
                .take(40)
        val maximum = scored.first().score
        val relevant = scored.filter { it.score >= maximum - 9.0 }
        val weighted = relevant.map { it to exp((it.score - maximum) / 3.4) }
        var target = seededUnit(seed xor 0x05ebca6b) * weighted.sumOf { it.second }
        var selected = weighted.first().first
        for ((candidate, weight) in weighted) {
            target -= weight
            if (target <= 0.0) {
                selected = candidate
                break
            }
        }

        val blocked =
            (history.take(40).map { it.messageId } + excludedMessageIds).toSet()
        val recentMessages = history.take(24).map { it.message }
        var best: Pair<Composition, Double>? = null
        repeat(72) { attempt ->
            val composition =
                compose(
                    selected.principle,
                    contexts,
                    signals,
                    profile,
                    preferences,
                    seed,
                    attempt,
                )
            val similarity = recentMessages.maxOfOrNull { jaccard(composition.message, it) } ?: 0.0
            val utility = -similarity * 11.0 - if (composition.messageId in blocked) 100.0 else 0.0
            if (utility > (best?.second ?: Double.NEGATIVE_INFINITY)) best = composition to utility
        }
        val composition = checkNotNull(best).first
        return EncouragementDraft(
            context = contexts.primary,
            secondaryContext = contexts.secondary,
            principleId = selected.principle.id,
            principleTitle = selected.principle.title,
            principleSource = selected.principle.sourceLabel,
            principleSourceId = selected.principle.sourceId,
            matchedSignals = signals,
            messageId = composition.messageId,
            heading = if (subject.focusSession) "Focus block complete" else "Completed: ${subject.title}",
            message = composition.message,
        )
    }

    private fun classifyContexts(subject: CompletionSubject, profile: UserProfile): ContextMatch {
        val category = normalize(subject.category)
        val title = normalize(subject.title)
        val details = normalize(subject.details)
        val profileText = normalize("${profile.role} ${profile.goals}")
        val scores =
            EncouragementCatalog.contexts
                .filterKeys { it != EncouragementContext.GENERAL }
                .mapValues { (_, definition) ->
                    var score = if (category == normalize(definition.label)) 8.0 else 0.0
                    definition.keywords.forEach { keyword ->
                        if (includesKeyword(category, keyword)) score += 5.0
                        if (includesKeyword(title, keyword)) score += 3.0
                        if (includesKeyword(details, keyword)) score += 1.5
                        if (includesKeyword(profileText, keyword)) score += 0.4
                    }
                    score
                }.toMutableMap()
        if (subject.focusSession) scores[EncouragementContext.FOCUS] = (scores[EncouragementContext.FOCUS] ?: 0.0) + 100.0
        val ranked = scores.filterValues { it > 0.0 }.entries.sortedByDescending { it.value }
        val primary = ranked.firstOrNull()?.key ?: EncouragementContext.GENERAL
        val firstScore = ranked.firstOrNull()?.value ?: 0.0
        val secondary =
            ranked.firstOrNull {
                it.key != primary && it.value >= max(3.0, firstScore * 0.22)
            }?.key
        return ContextMatch(primary, secondary, scores)
    }

    private fun deriveSignals(
        subject: CompletionSubject,
        contexts: ContextMatch,
        history: List<Encouragement>,
        profile: UserProfile,
        completedAt: String,
    ): Set<EncouragementSignal> =
        buildSet {
            val text = normalize("${subject.title} ${subject.details} ${subject.category}")
            val age = hoursBetween(subject.createdAt, completedAt)
            if (subject.priority == Priority.URGENT || subject.priority == Priority.HIGH) add(EncouragementSignal.HIGH_PRIORITY)
            if (age >= 72) add(EncouragementSignal.DELAYED)
            if (age >= 168) add(EncouragementSignal.LONG_CARRIED)
            if (history.none { sameLocalDay(it.createdAt, completedAt) }) add(EncouragementSignal.FIRST_TODAY)
            if ((history.size + 1) % 5 == 0) add(EncouragementSignal.MILESTONE)
            if (history.firstOrNull()?.let { hoursBetween(it.createdAt, completedAt) >= 48 } == true) add(EncouragementSignal.RETURNING)
            if (profile.goals.isNotBlank() && overlaps(text, profile.goals)) add(EncouragementSignal.GOAL_ALIGNED)
            if (subject.focusSession || contexts.primary == EncouragementContext.FOCUS) add(EncouragementSignal.FOCUSED)
            if (containsAny(text, uncertainKeywords) || contexts.primary in setOf(EncouragementContext.COURAGE, EncouragementContext.TRANSITION)) add(EncouragementSignal.UNCERTAIN_PATH)
            if (containsAny(text, restorativeKeywords) || contexts.primary == EncouragementContext.RECOVERY) add(EncouragementSignal.RESTORATIVE)
            if (containsAny(text, foundationKeywords) || contexts.primary in setOf(EncouragementContext.PLANNING, EncouragementContext.HOME, EncouragementContext.FINANCE)) add(EncouragementSignal.FOUNDATION_BUILDING)
            if (containsAny(text, sharedKeywords) || contexts.primary in setOf(EncouragementContext.FAMILY, EncouragementContext.COMMUNITY, EncouragementContext.CAREGIVING)) add(EncouragementSignal.SHARED_BENEFIT)
            if (contexts.primary == EncouragementContext.CREATIVE || contexts.secondary == EncouragementContext.CREATIVE) add(EncouragementSignal.CREATIVE_OUTPUT)
            if (contexts.primary == EncouragementContext.EDUCATION || contexts.secondary == EncouragementContext.EDUCATION) add(EncouragementSignal.LEARNING_PROGRESS)
            if (EncouragementSignal.GOAL_ALIGNED in this || contexts.primary == EncouragementContext.GROWTH) add(EncouragementSignal.IDENTITY_ALIGNED)
            val related = history.take(40).count { it.context == contexts.primary || overlaps(it.subjectTitle, subject.title) }
            if (related >= 2 || containsAny(text, practiceKeywords)) add(EncouragementSignal.STEADY_PRACTICE)
        }

    private fun scorePrinciple(
        principle: EncouragementPrinciple,
        contexts: ContextMatch,
        signals: Set<EncouragementSignal>,
        subjectText: String,
        history: List<Encouragement>,
        preferences: EncouragementPreferences,
        seed: Int,
    ): Double {
        var score = 0.0
        if (contexts.primary in principle.contexts) score += 8.0
        if (contexts.secondary != null && contexts.secondary in principle.contexts) score += 3.5
        if (EncouragementContext.GENERAL in principle.contexts) score += 1.0
        score += signals.count { it in principle.signals } * 3.25
        score += min(5, principle.keywords.count { includesKeyword(subjectText, it) }) * 1.4
        val savedPrinciple = history.count { it.saved && it.principleId == principle.id }
        val dismissedPrinciple = history.count { it.dismissed && it.principleId == principle.id }
        val savedSource = history.count { it.saved && it.principleSourceId == principle.sourceId }
        val dismissedSource = history.count { it.dismissed && it.principleSourceId == principle.sourceId }
        score += min(savedPrinciple, 4) * 2.0
        score -= min(dismissedPrinciple, 4) * 2.5
        score += min(savedSource, 6) * 0.55
        score -= min(dismissedSource, 6) * 0.65
        if (principle.id in preferences.pinnedPrincipleIds) score += 5.0
        val recent = history.take(18)
        val recentIndex = recent.indexOfFirst { it.principleId == principle.id }
        if (recentIndex >= 0) {
            val repetition = max(1.5, 7.0 - recentIndex * 0.45)
            val factor = if (principle.id in preferences.pinnedPrincipleIds) 0.1 else if (savedPrinciple > 0) 0.3 else 1.0
            score -= repetition * factor
        }
        if (history.none { it.principleId == principle.id }) score += 0.8
        score -= min(recent.count { it.principleSourceId == principle.sourceId }, 5) * 0.35
        score += seededUnit(seed xor hashString(principle.id)) * 1.2
        return score
    }

    private fun compose(
        principle: EncouragementPrinciple,
        contexts: ContextMatch,
        signals: Set<EncouragementSignal>,
        profile: UserProfile,
        preferences: EncouragementPreferences,
        seed: Int,
        attempt: Int,
    ): Composition {
        val definition = checkNotNull(EncouragementCatalog.contexts[contexts.primary])
        val selectedSignal = signals.firstOrNull { it in principle.signals } ?: signals.firstOrNull()
        val evidence = selectedSignal?.let { EncouragementCatalog.signalEvidence[it] }.orEmpty()
        val closings = checkNotNull(EncouragementCatalog.toneClosings[preferences.tone])
        val plan = checkNotNull(EncouragementCatalog.planningClosings[profile.planningStyle])
        val leadIndex = index(seed + attempt * 7, definition.leads.size)
        val evidenceIndex = if (evidence.isEmpty()) -1 else index(seed + attempt * 13, evidence.size)
        val practiceIndex = if (principle.practices.isEmpty()) -1 else index(seed + attempt * 17, principle.practices.size)
        val closingIndex = index(seed + attempt * 19, closings.size)
        val planIndex = index(seed + attempt * 23, plan.size)
        val bridgeIndex = index(seed + attempt * 29, EncouragementCatalog.contextBridges.size)
        val nameIndex = index(seed + attempt * 31, 3)
        val lead = definition.leads[leadIndex]
        val name = profile.preferredName.trim().takeIf { preferences.usePreferredName && it.isNotBlank() }
        val opening =
            when {
                name == null -> lead
                nameIndex == 0 -> "$name, ${lead.replaceFirstChar { it.lowercase() }}"
                nameIndex == 1 -> "$lead Take that in, $name."
                else -> "$lead $name, this one deserves an honest acknowledgment."
            }
        val parts = mutableListOf(opening, checkNotNull(principle.tones[preferences.tone]))
        if (evidenceIndex >= 0) parts += evidence[evidenceIndex]
        if (preferences.length == EncouragementLength.DEEPER) {
            val summary = principle.summary.replaceFirstChar { it.lowercase() }
            parts += "${EncouragementCatalog.contextBridges[bridgeIndex]} $summary"
            if (practiceIndex >= 0) parts += "A useful way to carry this forward: ${principle.practices[practiceIndex]}"
            parts += plan[planIndex]
        } else {
            parts += closings[closingIndex]
        }
        val messageId =
            listOf(
                principle.id,
                contexts.primary,
                contexts.secondary ?: "none",
                preferences.tone,
                preferences.length,
                leadIndex,
                selectedSignal ?: "none",
                evidenceIndex,
                practiceIndex,
                if (preferences.length == EncouragementLength.DEEPER) planIndex else closingIndex,
                if (name == null) -1 else nameIndex,
            ).joinToString(":")
        return Composition(parts.joinToString(" "), messageId)
    }

    private fun normalize(value: String): String =
        value.lowercase().replace(Regex("[^a-z0-9\\s-]"), " ").replace(Regex("\\s+"), " ").trim()

    private fun meaningfulWords(value: String): Set<String> =
        normalize(value).split(Regex("\\s+")).filter { it.length >= 4 && it !in stopWords }.toSet()

    private fun includesKeyword(text: String, keyword: String): Boolean {
        val clean = normalize(keyword)
        if (clean.isBlank()) return false
        return if (' ' in clean || '-' in clean) clean in text else clean in text.split(' ').toSet()
    }

    private fun containsAny(text: String, keywords: List<String>): Boolean = keywords.any { includesKeyword(text, it) }

    private fun overlaps(left: String, right: String): Boolean =
        meaningfulWords(left).intersect(meaningfulWords(right)).isNotEmpty()

    private fun jaccard(left: String, right: String): Double {
        val leftWords = meaningfulWords(left)
        val rightWords = meaningfulWords(right)
        if (leftWords.isEmpty() || rightWords.isEmpty()) return 0.0
        return leftWords.intersect(rightWords).size.toDouble() / leftWords.union(rightWords).size
    }

    private fun hoursBetween(earlier: String, later: String): Long =
        runCatching {
            max(0L, java.time.Duration.between(Instant.parse(earlier), Instant.parse(later)).toHours())
        }.getOrDefault(0L)

    private fun sameLocalDay(left: String, right: String): Boolean =
        runCatching {
            val zone = ZoneId.systemDefault()
            Instant.parse(left).atZone(zone).toLocalDate() == Instant.parse(right).atZone(zone).toLocalDate()
        }.getOrDefault(false)

    private fun hashString(value: String): Int {
        var hash = 0x811c9dc5L
        value.forEach { char ->
            hash = hash xor char.code.toLong()
            hash = (hash * 16777619L) and 0xffffffffL
        }
        return hash.toInt()
    }

    private fun seededUnit(seed: Int): Double {
        val value = (1664525L * (seed.toLong() and 0xffffffffL) + 1013904223L) and 0xffffffffL
        return value.toDouble() / 4294967296.0
    }

    private fun index(value: Int, size: Int): Int = Math.floorMod(value, size)
}
