package com.flameborne.echiron

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import org.junit.Rule
import org.junit.Test

class OnboardingTest {
    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun onboardingIdentityIsVisible() {
        composeRule.onNodeWithText("ECHIRON").assertIsDisplayed()
        composeRule.onNodeWithText("Begin with your name.").assertIsDisplayed()
    }
}
