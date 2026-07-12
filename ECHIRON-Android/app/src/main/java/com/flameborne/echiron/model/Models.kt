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

data class UserProfile(
    val preferredName: String = "",
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
    val heading: String,
    val message: String,
    val createdAt: String,
)

data class EchironState(
    val profile: UserProfile = UserProfile(),
    val onboardingComplete: Boolean = false,
    val tasks: List<EchironTask> = emptyList(),
    val focusMinutes: Int = 0,
    val focusSessions: Int = 0,
    val encouragementHistory: List<Encouragement> = emptyList(),
)

object MomentumCalculator {
    fun score(state: EchironState): Int {
        val completed = state.tasks.count { it.completed }
        return min(100, 45 + completed * 10 + state.focusSessions * 5)
    }
}

object EncouragementEngine {
    fun forCompletedTask(task: EchironTask): Pair<String, String> {
        val heading = when (task.priority) {
            Priority.URGENT -> "Pressure met with action"
            Priority.HIGH -> "A meaningful win"
            Priority.MEDIUM -> "Momentum is building"
            Priority.LOW -> "Small progress still counts"
        }
        val message =
            "You completed “${task.title}.” ECHIRON records the action, not a judgment of your worth. " +
                "See the progress. Protect the next good step."
        return heading to message
    }

    fun forFocusSession(minutes: Int): Pair<String, String> =
        "Focus protected" to
            "You defended $minutes minutes for meaningful work. Attention became action, and action became proof."
}
