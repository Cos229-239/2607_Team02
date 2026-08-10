package com.flameborne.echiron.ui

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.flameborne.echiron.integration.google.GoogleCalendarAuthorization

@Composable
fun GoogleCalendarIntegrationScreen() {
    val context = LocalContext.current
    val activity = context.findActivity()
    var connectionStatus by rememberSaveable { mutableStateOf("Not connected") }

    val resolutionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartIntentSenderForResult(),
    ) { result ->
        if (result.resultCode != Activity.RESULT_OK || activity == null) {
            connectionStatus = "Google Calendar connection cancelled"
            return@rememberLauncherForActivityResult
        }

        runCatching {
            GoogleCalendarAuthorization.resultFromIntent(activity, result.data)
        }.onSuccess { authorizationResult ->
            connectionStatus = if (authorizationResult.accessToken.isNullOrBlank()) {
                "Google Calendar authorized"
            } else {
                "Google Calendar connected"
            }
        }.onFailure { error ->
            connectionStatus = "Connection failed: ${error.localizedMessage ?: "Unknown error"}"
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text(
            text = "Google Calendar",
            style = MaterialTheme.typography.headlineMedium,
        )
        Text(
            text = "Connect your Google Calendar so ECHIRON can read your calendar and later bring selected scheduling information into your tasks and planning views.",
            style = MaterialTheme.typography.bodyLarge,
        )

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(
                    text = "Status",
                    style = MaterialTheme.typography.titleMedium,
                )
                Text(connectionStatus)

                Button(
                    enabled = activity != null,
                    onClick = {
                        val hostActivity = activity ?: return@Button
                        connectionStatus = "Connecting to Google Calendar…"
                        GoogleCalendarAuthorization.authorize(
                            activity = hostActivity,
                            resolutionLauncher = resolutionLauncher,
                            onAuthorized = { authorizationResult ->
                                connectionStatus = if (authorizationResult.accessToken.isNullOrBlank()) {
                                    "Google Calendar authorized"
                                } else {
                                    "Google Calendar connected"
                                }
                            },
                            onError = { error ->
                                connectionStatus = "Connection failed: ${error.localizedMessage ?: "Unknown error"}"
                            },
                        )
                    },
                ) {
                    Icon(Icons.Default.CalendarMonth, contentDescription = null)
                    Text(" Connect Google Calendar")
                }
            }
        }

        Text(
            text = "ECHIRON currently requests read-only Calendar access. It does not request permission to create, edit, or delete Google Calendar events.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

private tailrec fun Context.findActivity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.findActivity()
    else -> null
}
