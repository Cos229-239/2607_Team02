package com.flameborne.echiron.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors =
    lightColorScheme(
        primary = Color(0xFF4F46E5),
        onPrimary = Color.White,
        secondary = Color(0xFF0F766E),
        onSecondary = Color.White,
        background = Color(0xFFF8FAFC),
        onBackground = Color(0xFF0F172A),
        surface = Color.White,
        onSurface = Color(0xFF0F172A),
        surfaceVariant = Color(0xFFF1F5F9),
        onSurfaceVariant = Color(0xFF475569),
        outline = Color(0xFFCBD5E1),
        error = Color(0xFFB91C1C),
    )

private val DarkColors =
    darkColorScheme(
        primary = Color(0xFF818CF8),
        onPrimary = Color(0xFF11124D),
        secondary = Color(0xFF5EEAD4),
        onSecondary = Color(0xFF042F2E),
        background = Color(0xFF020617),
        onBackground = Color(0xFFF8FAFC),
        surface = Color(0xFF0F172A),
        onSurface = Color(0xFFF8FAFC),
        surfaceVariant = Color(0xFF1E293B),
        onSurfaceVariant = Color(0xFFCBD5E1),
        outline = Color(0xFF475569),
        error = Color(0xFFFCA5A5),
    )

@Composable
fun EchironTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (isSystemInDarkTheme()) DarkColors else LightColors,
        content = content,
    )
}
