package com.flameborne.echiron

import com.flameborne.echiron.model.EchironState
import com.flameborne.echiron.model.EchironTask
import com.flameborne.echiron.model.MomentumCalculator
import com.flameborne.echiron.model.Priority
import org.junit.Assert.assertEquals
import org.junit.Test

class MomentumScoreTest {
    @Test
    fun scoreCountsCompletedTasksAndFocusSessions() {
        val state =
            EchironState(
                tasks =
                    listOf(
                        task("1", completed = true),
                        task("2", completed = true),
                        task("3", completed = false),
                    ),
                focusSessions = 3,
            )

        assertEquals(80, MomentumCalculator.score(state))
    }

    @Test
    fun scoreNeverExceedsOneHundred() {
        val state =
            EchironState(
                tasks = (1..20).map { task(it.toString(), completed = true) },
                focusSessions = 20,
            )

        assertEquals(100, MomentumCalculator.score(state))
    }

    private fun task(id: String, completed: Boolean) =
        EchironTask(
            id = id,
            title = "Task $id",
            priority = Priority.MEDIUM,
            completed = completed,
            createdAt = "2026-07-11T00:00:00Z",
        )
}
