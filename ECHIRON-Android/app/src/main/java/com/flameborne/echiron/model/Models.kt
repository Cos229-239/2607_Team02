package com.flameborne.echiron.model

import kotlin.math.min

enum class Priority(val label: String, val weight: Int) {
    LOW("Low", 1),
    MEDIUM("Medium", 2),
    HIGH("High", 3),
    URGENT("Urgent", 4),
}

enum class DayKey(val label: String) {
    MONDAY("Mon"),
    TUESDAY("Tue"),
    WEDNESDAY("Wed"),
    THURSDAY("Thu"),
    FRIDAY("Fri"),
    SATURDAY("Sat"),
    SUNDAY("Sun"),
}

enum class PlanningStyle { STRUCTURED, BALANCED, FLEXIBLE }
enum class EncouragementTone { GENTLE, BALANCED, DIRECT, ENERGETIC, REFLECTIVE }
enum class EncouragementLength { BRIEF, DEEPER }

enum class EncouragementContext {
    EDUCATION,
    WORK,
    HEALTH,
    FAMILY,
    HOME,
    CREATIVE,
    FINANCE,
    GROWTH,
    FOCUS,
    PLANNING,
    RECOVERY,
    COMMUNITY,
    CAREGIVING,
    TRANSITION,
    COURAGE,
    GENERAL,
}

enum class EncouragementSignal {
    HIGH_PRIORITY,
    DELAYED,
    FIRST_TODAY,
    MILESTONE,
    RETURNING,
    GOAL_ALIGNED,
    FOCUSED,
    LONG_CARRIED,
    STEADY_PRACTICE,
    SHARED_BENEFIT,
    FOUNDATION_BUILDING,
    RESTORATIVE,
    CREATIVE_OUTPUT,
    LEARNING_PROGRESS,
    UNCERTAIN_PATH,
    IDENTITY_ALIGNED,
}

data class UserProfile(
    val preferredName: String = "",
    val role: String = "",
    val goals: String = "",
    val planningStyle: PlanningStyle = PlanningStyle.BALANCED,
)

data class EncouragementPreferences(
    val tone: EncouragementTone = EncouragementTone.BALANCED,
    val length: EncouragementLength = EncouragementLength.BRIEF,
    val usePreferredName: Boolean = true,
    val spiritualEnabled: Boolean = false,
    val pinnedPrincipleIds: Set<String> = emptySet(),
)

data class EchironTask(
    val id: String,
    val title: String,
    val details: String = "",
    val category: String = "General",
    val priority: Priority = Priority.MEDIUM,
    val dueDay: DayKey? = null,
    val completed: Boolean = false,
    val createdAt: String,
    val completedAt: String? = null,
)

data class Encouragement(
    val id: String,
    val sourceId: String = "",
    val subjectTitle: String = "",
    val subjectDetails: String = "",
    val subjectCategory: String = "General",
    val subjectPriority: Priority = Priority.MEDIUM,
    val subjectCreatedAt: String = "",
    val context: EncouragementContext = EncouragementContext.GENERAL,
    val secondaryContext: EncouragementContext? = null,
    val principleId: String = "legacy",
    val principleTitle: String = "Progress without punishment",
    val principleSource: String = "Echiron synthesis",
    val principleSourceId: String = "echiron",
    val matchedSignals: Set<EncouragementSignal> = emptySet(),
    val messageId: String = id,
    val heading: String,
    val message: String,
    val createdAt: String,
    val saved: Boolean = false,
    val dismissed: Boolean = false,
)

data class EchironState(
    val profile: UserProfile = UserProfile(),
    val onboardingComplete: Boolean = false,
    val tasks: List<EchironTask> = emptyList(),
    val focusMinutes: Int = 0,
    val focusSessions: Int = 0,
    val encouragementPreferences: EncouragementPreferences = EncouragementPreferences(),
    val encouragementHistory: List<Encouragement> = emptyList(),
)

object MomentumCalculator {
    fun score(state: EchironState): Int {
        val completed = state.tasks.count { it.completed }
        return min(100, 45 + completed * 10 + state.focusSessions * 5)
    }
}
