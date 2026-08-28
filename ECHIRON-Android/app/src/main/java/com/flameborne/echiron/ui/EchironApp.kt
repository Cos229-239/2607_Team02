package com.flameborne.echiron.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.flameborne.echiron.integration.google.GoogleCalendarEvent
import com.flameborne.echiron.model.DayKey
import com.flameborne.echiron.model.EchironState
import com.flameborne.echiron.model.EncouragementPreferences
import com.flameborne.echiron.model.Priority
import com.flameborne.echiron.ui.theme.EchironTheme

private enum class AppSection(val label: String, val icon: ImageVector) {
    TODAY("Today", Icons.Default.Home),
    TASKS("Tasks", Icons.Default.List),
    WEEK("Week", Icons.Default.DateRange),
    PROGRESS("Progress", Icons.Default.Star),
    ENCOURAGEMENT("Encourage", Icons.Default.Favorite),
    INTEGRATIONS("Connect", Icons.Default.Settings),
}

@Composable
fun EchironApp(viewModel: EchironViewModel = viewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    EchironTheme {
        if (!state.onboardingComplete) {
            OnboardingScreen(viewModel::completeOnboarding)
        } else {
            MainExperience(
                state = state,
                onAddTask = viewModel::addTask,
                onImportCalendarEvent = viewModel::importCalendarEvent,
                onToggleTask = viewModel::toggleTask,
                onDeleteTask = viewModel::deleteTask,
                onFocus = viewModel::recordFocusSession,
                onSaveEncouragement = viewModel::toggleSavedEncouragement,
                onDismissEncouragement = viewModel::dismissEncouragement,
                onAnotherEncouragement = viewModel::requestAnotherEncouragement,
                onUpdateEncouragementPreferences = viewModel::updateEncouragementPreferences,
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun MainExperience(
    state: EchironState,
    onAddTask: (String, String, String, Priority, DayKey?) -> Unit,
    onImportCalendarEvent: (GoogleCalendarEvent) -> Unit,
    onToggleTask: (String) -> Unit,
    onDeleteTask: (String) -> Unit,
    onFocus: (Int) -> Unit,
    onSaveEncouragement: (String) -> Unit,
    onDismissEncouragement: (String) -> Unit,
    onAnotherEncouragement: (String) -> Unit,
    onUpdateEncouragementPreferences: (EncouragementPreferences) -> Unit,
) {
    var section by rememberSaveable { mutableStateOf(AppSection.TODAY) }
    var showCapture by rememberSaveable { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("ECHIRON", fontWeight = FontWeight.ExtraBold)
                        Text(
                            "Human progress, made visible",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                },
            )
        },
        bottomBar = {
            NavigationBar {
                AppSection.entries.forEach { destination ->
                    NavigationBarItem(
                        selected = section == destination,
                        onClick = { section = destination },
                        icon = { Icon(destination.icon, contentDescription = destination.label) },
                        label = {
                            Text(
                                destination.label,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        },
                    )
                }
            }
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { showCapture = true },
                icon = { Icon(Icons.Default.Add, contentDescription = null) },
                text = { Text("Quick capture") },
            )
        },
    ) { padding ->
        Box(Modifier.fillMaxSize().padding(padding)) {
            when (section) {
                AppSection.TODAY -> DashboardScreen(state, { showCapture = true }, onToggleTask, onFocus)
                AppSection.TASKS -> TasksScreen(state.tasks, onToggleTask, onDeleteTask)
                AppSection.WEEK -> WeeklyPlanScreen(state.tasks, onToggleTask)
                AppSection.PROGRESS -> ProgressScreen(state)
                AppSection.ENCOURAGEMENT ->
                    EncouragementScreen(
                        state,
                        onSaveEncouragement,
                        onDismissEncouragement,
                        onAnotherEncouragement,
                        onUpdateEncouragementPreferences,
                    )
                AppSection.INTEGRATIONS -> GoogleCalendarIntegrationScreen(onImportCalendarEvent)
            }
        }
    }

    if (showCapture) {
        QuickCaptureDialog(
            onDismiss = { showCapture = false },
            onSave = { title, details, category, priority, day ->
                onAddTask(title, details, category, priority, day)
                showCapture = false
            },
        )
    }
}
