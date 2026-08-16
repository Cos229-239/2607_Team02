package com.flameborne.echiron.integration.google

import org.json.JSONObject
import java.io.IOException
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.time.Instant
import javax.net.ssl.HttpsURLConnection
import java.net.URL

data class GoogleCalendarSummary(
    val id: String,
    val summary: String,
    val primary: Boolean,
    val timeZone: String?,
)

data class GoogleCalendarEvent(
    val id: String,
    val title: String,
    val description: String?,
    val start: String?,
    val end: String?,
    val allDay: Boolean,
    val location: String?,
    val status: String?,
    val recurrence: List<String>,
    val updated: String?,
)

object GoogleCalendarApi {
    private const val API_ROOT = "https://www.googleapis.com/calendar/v3"
    private const val CONNECT_TIMEOUT_MS = 15_000
    private const val READ_TIMEOUT_MS = 15_000

    /**
     * Returns every visible calendar in the signed-in user's Google Calendar list.
     * The Calendar read-only OAuth scope used by ECHIRON is sufficient for this call.
     */
    fun listCalendars(accessToken: String): List<GoogleCalendarSummary> {
        require(accessToken.isNotBlank()) { "Google access token is required." }

        val calendars = mutableListOf<GoogleCalendarSummary>()
        var pageToken: String? = null

        do {
            val pageTokenQuery = pageToken?.let {
                "&pageToken=${encodeQueryValue(it)}"
            }.orEmpty()

            val response = getJson(
                accessToken = accessToken,
                url = "$API_ROOT/users/me/calendarList?maxResults=250$pageTokenQuery",
            )

            val items = response.optJSONArray("items")
            if (items != null) {
                for (index in 0 until items.length()) {
                    val item = items.getJSONObject(index)
                    calendars += GoogleCalendarSummary(
                        id = item.getString("id"),
                        summary = item.optString("summary").ifBlank { "Untitled calendar" },
                        primary = item.optBoolean("primary", false),
                        timeZone = item.optionalString("timeZone"),
                    )
                }
            }

            pageToken = response.optionalString("nextPageToken")
        } while (pageToken != null)

        return calendars
    }

    /**
     * Loads upcoming events for a selected Google calendar.
     * Recurring events are expanded into individual instances and ordered by start time.
     */
    fun listUpcomingEvents(
        accessToken: String,
        calendarId: String,
        maxResults: Int = 25,
    ): List<GoogleCalendarEvent> {
        require(accessToken.isNotBlank()) { "Google access token is required." }
        require(calendarId.isNotBlank()) { "Google calendar ID is required." }
        require(maxResults in 1..2500) { "maxResults must be between 1 and 2500." }

        val encodedCalendarId = encodePathSegment(calendarId)
        val timeMin = encodeQueryValue(Instant.now().toString())
        val url = "$API_ROOT/calendars/$encodedCalendarId/events" +
            "?maxResults=$maxResults" +
            "&singleEvents=true" +
            "&orderBy=startTime" +
            "&showDeleted=false" +
            "&timeMin=$timeMin"

        val response = getJson(accessToken = accessToken, url = url)
        val events = mutableListOf<GoogleCalendarEvent>()
        val items = response.optJSONArray("items") ?: return emptyList()

        for (index in 0 until items.length()) {
            val item = items.getJSONObject(index)
            val startObject = item.optJSONObject("start")
            val endObject = item.optJSONObject("end")
            val startDateTime = startObject?.optionalString("dateTime")
            val startDate = startObject?.optionalString("date")
            val endDateTime = endObject?.optionalString("dateTime")
            val endDate = endObject?.optionalString("date")

            val recurrenceValues = buildList {
                val recurrence = item.optJSONArray("recurrence")
                if (recurrence != null) {
                    for (recurrenceIndex in 0 until recurrence.length()) {
                        add(recurrence.getString(recurrenceIndex))
                    }
                }
            }

            events += GoogleCalendarEvent(
                id = item.getString("id"),
                title = item.optString("summary").ifBlank { "Untitled event" },
                description = item.optionalString("description"),
                start = startDateTime ?: startDate,
                end = endDateTime ?: endDate,
                allDay = startDateTime == null && startDate != null,
                location = item.optionalString("location"),
                status = item.optionalString("status"),
                recurrence = recurrenceValues,
                updated = item.optionalString("updated"),
            )
        }

        return events
    }

    private fun getJson(accessToken: String, url: String): JSONObject {
        val connection = (URL(url).openConnection() as HttpsURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = CONNECT_TIMEOUT_MS
            readTimeout = READ_TIMEOUT_MS
            setRequestProperty("Authorization", "Bearer $accessToken")
            setRequestProperty("Accept", "application/json")
        }

        return try {
            val responseCode = connection.responseCode
            val responseText = if (responseCode in 200..299) {
                connection.inputStream.bufferedReader().use { it.readText() }
            } else {
                connection.errorStream?.bufferedReader()?.use { it.readText() }.orEmpty()
            }

            if (responseCode !in 200..299) {
                val compactError = responseText.take(500).ifBlank { "No response body" }
                throw IOException("Google Calendar API request failed ($responseCode): $compactError")
            }

            JSONObject(responseText)
        } finally {
            connection.disconnect()
        }
    }

    private fun encodePathSegment(value: String): String =
        URLEncoder.encode(value, StandardCharsets.UTF_8.toString()).replace("+", "%20")

    private fun encodeQueryValue(value: String): String =
        URLEncoder.encode(value, StandardCharsets.UTF_8.toString()).replace("+", "%20")

    private fun JSONObject.optionalString(name: String): String? =
        if (has(name) && !isNull(name)) optString(name).takeIf { it.isNotBlank() } else null
}
