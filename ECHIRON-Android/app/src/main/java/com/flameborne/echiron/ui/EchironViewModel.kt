package com.flameborne.echiron.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.flameborne.echiron.data.EchironRepository
import com.flameborne.echiron.model.DayKey
import com.flameborne.echiron.model.EchironState
import com.flameborne.echiron.model.EchironTask
import com.flameborne.echiron.model.Priority
import java.time.Instant
import java.util.UUID
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class EchironViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = EchironRepository(application.applicationContext)

    val state =
        repository.state.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(stopTimeoutMillis = 5_000),
            initialValue = EchironState(),
        )

    fun completeOnboarding(preferredName: String) {
        viewModelScope.launch {
            repository.saveProfile(preferredName)
        }
    }

    fun addTask(
        title: String,
        details: String,
        category: String,
        priority: Priority,
        dueDay: DayKey?,
    ) {
        val cleanTitle = title.trim()
        if (cleanTitle.isBlank()) return

        viewModelScope.launch {
            repository.addTask(
                EchironTask(
                    id = UUID.randomUUID().toString(),
                    title = cleanTitle,
                    details = details.trim(),
                    category = category.trim().ifBlank { "General" },
                    priority = priority,
                    dueDay = dueDay,
                    createdAt = Instant.now().toString(),
                ),
            )
        }
    }

    fun toggleTask(taskId: String) {
        viewModelScope.launch {
            repository.toggleTask(taskId)
        }
    }

    fun deleteTask(taskId: String) {
        viewModelScope.launch {
            repository.deleteTask(taskId)
        }
    }

    fun recordFocusSession(minutes: Int = 25) {
        viewModelScope.launch {
            repository.recordFocusSession(minutes)
        }
    }
}
