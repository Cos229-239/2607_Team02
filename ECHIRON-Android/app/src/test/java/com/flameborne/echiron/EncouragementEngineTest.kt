package com.flameborne.echiron

import com.flameborne.echiron.model.CompletionSubject
import com.flameborne.echiron.model.EncouragementCatalog
import com.flameborne.echiron.model.EncouragementEngine
import com.flameborne.echiron.model.EncouragementLength
import com.flameborne.echiron.model.EncouragementPreferences
import com.flameborne.echiron.model.EncouragementTone
import com.flameborne.echiron.model.Priority
import com.flameborne.echiron.model.UserProfile
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class EncouragementEngineTest {
    private val profile =
        UserProfile(
            preferredName = "Avery",
            role = "Community college student and caregiver",
            goals = "Finish nursing school, protect my health, and support my family",
        )
    private val preferences = EncouragementPreferences()

    @Test
    fun catalogIsBroadAttributableAndUnique() {
        assertEquals(134, EncouragementCatalog.principles.size)
        assertEquals(16, EncouragementCatalog.contexts.size)
        assertTrue(EncouragementCatalog.principles.map { it.sourceId }.toSet().size >= 30)
        assertEquals(
            EncouragementCatalog.principles.size,
            EncouragementCatalog.principles.map { it.id }.toSet().size,
        )
        assertTrue(EncouragementCatalog.principles.all { it.sourceId.isNotBlank() && it.sourceLabel.isNotBlank() })
    }

    @Test
    fun generationIsDeterministicAndAnotherChangesComposition() {
        val first = generate(subject("same-seed"))
        val repeated = generate(subject("same-seed"))
        assertEquals(first, repeated)
        val another = generate(subject("same-seed"), setOf(first.messageId))
        assertNotEquals(first.messageId, another.messageId)
        assertNotEquals(first.message, another.message)
        assertTrue("Avery" in first.message)
    }

    @Test
    fun spiritualPrinciplesRemainOptIn() {
        repeat(150) { index ->
            val draft = generate(subject("spiritual-$index"))
            val principle = EncouragementCatalog.principles.first { it.id == draft.principleId }
            assertFalse(principle.spiritual)
        }
    }

    @Test
    fun variedContextsReachManyPrinciplesAndCompositions() {
        val scenarios =
            listOf(
                Triple("Submit the client proposal", "Finished pricing and sent it to the team.", "Work"),
                Triple("Take a recovery walk", "Moved gently after a difficult week.", "Health"),
                Triple("Call my father", "Checked in and listened without rushing.", "Relationships"),
                Triple("Finish the chapter draft", "Wrote and revised the closing scene.", "Creative work"),
                Triple("Organize the kitchen", "Cleared the counters and prepared meals.", "Home"),
                Triple("Ask for help", "Spoke honestly about an uncertain transition.", "Courageous action"),
                Triple("Volunteer at the food bank", "Packed boxes with neighbors.", "Community"),
                Triple("Plan next semester", "Mapped classes and important deadlines.", "Planning"),
            )
        val messageIds = mutableSetOf<String>()
        val principles = mutableSetOf<String>()
        repeat(240) { index ->
            val scenario = scenarios[index % scenarios.size]
            val draft =
                generate(
                    subject(
                        id = "variety-$index",
                        title = scenario.first,
                        details = scenario.second,
                        category = scenario.third,
                    ),
                    completedAt = "2026-07-${(1 + index % 12).toString().padStart(2, '0')}T${(index % 24).toString().padStart(2, '0')}:00:00Z",
                )
            messageIds += draft.messageId
            principles += draft.principleId
        }
        assertTrue("Expected substantial composition variety", messageIds.size >= 140)
        assertTrue("Expected broad principle reach", principles.size >= 40)
    }

    @Test
    fun allTonesAndDepthsAvoidProhibitedPatterns() {
        val banned =
            Regex(
                "you(?:'re| are) (?:lazy|broken|a failure)|should be ashamed|guarantee(?:d)? success|cure your|diagnos(?:e|is)|no excuses|everyone else",
                RegexOption.IGNORE_CASE,
            )
        EncouragementTone.entries.forEach { tone ->
            EncouragementLength.entries.forEach { length ->
                repeat(30) { index ->
                    val draft =
                        generate(
                            subject("safe-$tone-$length-$index"),
                            customPreferences = preferences.copy(tone = tone, length = length),
                        )
                    assertFalse(banned.containsMatchIn(draft.message))
                }
            }
        }
    }

    private fun subject(
        id: String,
        title: String = "Study medication safety notes",
        details: String = "Finish a review session for the nursing course.",
        category: String = "Learning",
    ) = CompletionSubject(
        sourceId = id,
        title = title,
        details = details,
        category = category,
        priority = Priority.HIGH,
        createdAt = "2026-07-01T16:00:00Z",
    )

    private fun generate(
        subject: CompletionSubject,
        excluded: Set<String> = emptySet(),
        completedAt: String = "2026-07-13T16:00:00Z",
        customPreferences: EncouragementPreferences = preferences,
    ) = EncouragementEngine.generate(
        subject = subject,
        profile = profile,
        history = emptyList(),
        preferences = customPreferences,
        completedAt = completedAt,
        excludedMessageIds = excluded,
    )
}
