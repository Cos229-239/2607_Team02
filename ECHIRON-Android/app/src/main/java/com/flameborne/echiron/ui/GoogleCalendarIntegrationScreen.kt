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
import com.flameborne.echiron.integration.google.GoogleCalendarApi
import com.flameborne.echiron.integration.google.GoogleCalendarAuthorization
import com.google.android.gms.auth.api.identity.AuthorizationResult

@Composable
fun GoogleCalendarIntegrationScreen() {
    val context = LocalContext.current
    val activity = context.findActivity()
    var connectionStatus by rememberSaveable { mutableStateOf("Not connected") }
    var calendarPreview by rememberSaveable { mutableStateOf("") }
    var eventPreview by rememberSaveable { mutableStateOf("") }

    val handleAuthorization: (AuthorizationResult) -> Unit = { authorizationResult ->
        val accessToken = authorizationResult.accessToken
        if (accessToken.isNullOrBlank() || activity == null) {
            connectionStatus = "Google Calendar authorized, but no API access token was returned"
        } else {
            connectionStatus = "Google Calendar connected — loading calendars…"
            calendarPreview = ""
            eventPreview = ""

            loadCalendarPreview(
                activity = activity,
                accessToken = accessToken,
                onLoaded = { calendarsText, eventsText ->
                    connectionStatus = "Google Calendar connected"
                    calendarPreview = calendarsText
                    eventPreview = eventsText
                },
                onError = { error ->
                    connectionStatus = "Calendar data load failed: ${error.localizedMessage ?: "Unknown error"}"
                },
            )
        }
    }

    val resolutionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartIntentSenderForResult(),
    ) { result ->
        if (result.resultCode != Activity.RESULT_OK || activity == null) {
            connectionStatus = "Google Calendar connection cancelled"
            return@rememberLauncherForActivityResult
        }

        runCatching {
            GoogleCalendarAuthorization.resultFromIntent(activity, result.data)
        }.onSuccess(handleAuthorization)
            .onFailure { error ->
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
            text = "Connect your Google Calendar so ECHIRON can read your calendar and bring selected scheduling information into your tasks and planning views.",
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
                        calendarPreview = ""
                        eventPreview = ""

                        GoogleCalendarAuthorization.authorize(
                            activity = hostActivity,
                            resolutionLauncher = resolutionLauncher,
                            onAuthorized = handleAuthorization,
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

        if (calendarPreview.isNotBlank()) {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(
                        text = "Calendars found",
                        style = MaterialTheme.typography.titleMedium,
                    )
                    Text(calendarPreview)
                }
            }
        }

        if (eventPreview.isNotBlank()) {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(
                        text = "Upcoming events",
                        style = MaterialTheme.typography.titleMedium,
                    )
                    Text(eventPreview)
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

private fun loadCalendarPreview(
    activity: Activity,
    accessToken: String,
    onLoaded: (String, String) -> Unit,
    onError: (Throwable) -> Unit,
) {
    Thread {
        runCatching {
            val calendars = GoogleCalendarApi.listCalendars(accessToken)
            val selectedCalendar = calendars.firstOrNull { it.primary } ?: calendars.firstOrNull()
            val events = selectedCalendar?.let {
                GoogleCalendarApi.listUpcomingEvents(
                    accessToken = accessToken,
                    calendarId = it.id,
                    maxResults = 10,
                )
            }.orEmpty()

            val calendarsText = if (calendars.isEmpty()) {
                "No calendars were returned."
            } else {
                val preview = calendars.take(5).joinToString("\n") { calendar ->
                    val primaryMarker = if (calendar.primary) " (Primary)" else ""
                    "• ${calendar.summary}$primaryMarker"
                }
                if (calendars.size > 5) "$preview\n• +${calendars.size - 5} more" else preview
            }

            val eventsText = when {
                selectedCalendar == null -> "No calendar is available for event retrieval."
                events.isEmpty() -> "No upcoming events were returned from ${selectedCalendar.summary}."
                else -> events.take(5).joinToString("\n") { event ->
                    val startLabel = event.start ?: "No start time"
                    "• ${event.title} — $startLabel"
                }
            }

            calendarsText to eventsText
        }.onSuccess { (calendarsText, eventsText) ->
            activity.runOnUiThread {
                onLoaded(calendarsText, eventsText)
            }
        }.onFailure { error ->
            activity.runOnUiThread {
                onError(error)
            }
        }
    }.start()
}

private tailrec fun Context.findActivity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.findActivity()
    else -> null
}
