package com.flameborne.echiron.integration.google

import com.flameborne.echiron.model.DayKey
import com.flameborne.echiron.model.EchironTask
import com.flameborne.echiron.model.Priority
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.OffsetDateTime

object GoogleCalendarTaskMapper {
    fun toTask(event: GoogleCalendarEvent): EchironTask =
        EchironTask(
            id = "google-calendar:${event.id}",
            title = event.title,
            details = buildDetails(event),
            category = "Calendar",
            priority = Priority.MEDIUM,
            dueDay = event.start?.let(::toDayKey),
            createdAt = event.updated ?: event.start ?: "1970-01-01T00:00:00Z",
        )

    private fun buildDetails(event: GoogleCalendarEvent): String =
        buildList {
            event.description?.takeIf { it.isNotBlank() }?.let(::add)
            event.start?.let { add("Calendar start: $it") }
            event.end?.let { add("Calendar end: $it") }
            event.location?.takeIf { it.isNotBlank() }?.let { add("Location: $it") }
            add("Imported from Google Calendar")
        }.joinToString("\n")

    private fun toDayKey(value: String): DayKey? =
        runCatching {
            val day = if (value.length == 10) {
                LocalDate.parse(value).dayOfWeek
            } else {
                OffsetDateTime.parse(value).dayOfWeek
            }
            when (day) {
                DayOfWeek.MONDAY -> DayKey.MONDAY
                DayOfWeek.TUESDAY -> DayKey.TUESDAY
                DayOfWeek.WEDNESDAY -> DayKey.WEDNESDAY
                DayOfWeek.THURSDAY -> DayKey.THURSDAY
                DayOfWeek.FRIDAY -> DayKey.FRIDAY
                DayOfWeek.SATURDAY -> DayKey.SATURDAY
                DayOfWeek.SUNDAY -> DayKey.SUNDAY
            }
        }.getOrNull()
}
