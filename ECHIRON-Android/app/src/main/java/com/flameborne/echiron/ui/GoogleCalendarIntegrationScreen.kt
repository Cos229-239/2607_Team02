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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.flameborne.echiron.integration.google.GoogleCalendarApi
import com.flameborne.echiron.integration.google.GoogleCalendarAuthorization
import com.flameborne.echiron.integration.google.GoogleCalendarEvent
import com.google.android.gms.auth.api.identity.AuthorizationResult

@Composable
fun GoogleCalendarIntegrationScreen(
    onImportEvent: (GoogleCalendarEvent) -> Unit,
) {
    val context = LocalContext.current
    val activity = context.findActivity()
    var connectionStatus by rememberSaveable { mutableStateOf("Not connected") }
    var calendarPreview by rememberSaveable { mutableStateOf("") }
    var eventPreview by rememberSaveable { mutableStateOf("") }
    var importStatus by rememberSaveable { mutableStateOf("") }
    var loadedEvents by remember { mutableStateOf(emptyList<GoogleCalendarEvent>()) }

    val handleAuthorization: (AuthorizationResult) -> Unit = { authorizationResult ->
        val accessToken = authorizationResult.accessToken
        if (accessToken.isNullOrBlank() || activity == null) {
            connectionStatus = "Google Calendar authorized, but no API access token was returned"
        } else {
            connectionStatus = "Google Calendar connected — loading calendars…"
            calendarPreview = ""
            eventPreview = ""
            importStatus = ""
            loadedEvents = emptyList()

            loadCalendarPreview(
                activity = activity,
                accessToken = accessToken,
                onLoaded = { calendarsText, eventsText, events ->
                    connectionStatus = "Google Calendar connected"
                    calendarPreview = calendarsText
                    eventPreview = eventsText
                    loadedEvents = events
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
            .verticalScroll(rememberScrollState())
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
                        importStatus = ""
                        loadedEvents = emptyList()

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
                    Icon(Icons.Default.DateRange, contentDescription = null)
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
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        text = "Upcoming events",
                        style = MaterialTheme.typography.titleMedium,
                    )

                    if (loadedEvents.isEmpty()) {
                        Text(eventPreview)
                    } else {
                        Text(
                            text = "${loadedEvents.size} upcoming event${if (loadedEvents.size == 1) "" else "s"} available for import.",
                            style = MaterialTheme.typography.bodyMedium,
                        )

                        Button(
                            onClick = {
                                loadedEvents.forEach(onImportEvent)
                                importStatus = "Imported ${loadedEvents.size} Calendar event${if (loadedEvents.size == 1) "" else "s"} into ECHIRON tasks"
                            },
                        ) {
                            Text("Import all upcoming events")
                        }

                        loadedEvents.forEach { event ->
                            Card(modifier = Modifier.fillMaxWidth()) {
                                Column(
                                    modifier = Modifier.padding(12.dp),
                                    verticalArrangement = Arrangement.spacedBy(6.dp),
                                ) {
                                    Text(
                                        text = event.title,
                                        style = MaterialTheme.typography.titleSmall,
                                    )
                                    Text(
                                        text = event.start ?: "No start time",
                                        style = MaterialTheme.typography.bodyMedium,
                                    )
                                    event.location?.takeIf { it.isNotBlank() }?.let { location ->
                                        Text(
                                            text = location,
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        )
                                    }
                                    Button(
                                        onClick = {
                                            onImportEvent(event)
                                            importStatus = "Imported '${event.title}' into ECHIRON tasks"
                                        },
                                    ) {
                                        Text("Import event")
                                    }
                                }
                            }
                        }
                    }

                    if (importStatus.isNotBlank()) {
                        Text(
                            text = importStatus,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.primary,
                        )
                    }
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
    onLoaded: (String, String, List<GoogleCalendarEvent>) -> Unit,
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
                else -> "Loaded ${events.size} upcoming event${if (events.size == 1) "" else "s"} from ${selectedCalendar.summary}."
            }

            Triple(calendarsText, eventsText, events)
        }.onSuccess { (calendarsText, eventsText, events) ->
            activity.runOnUiThread {
                onLoaded(calendarsText, eventsText, events)
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
