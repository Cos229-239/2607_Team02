package com.flameborne.echiron.ui

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.weight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.flameborne.echiron.model.DayKey
import com.flameborne.echiron.model.EchironTask
import com.flameborne.echiron.model.Priority

@Composable
internal fun TasksScreen(
    tasks: List<EchironTask>,
    onToggleTask: (String) -> Unit,
    onDeleteTask: (String) -> Unit,
) {
    var filter by rememberSaveable { mutableStateOf<Priority?>(null) }
    val visible =
        tasks
            .filter { filter == null || it.priority == filter }
            .sortedWith(compareBy<EchironTask> { it.completed }.thenByDescending { it.priority.weight })

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp, 16.dp, 16.dp, 120.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text("Priority board", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.ExtraBold)
            Row(
                modifier = Modifier.horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                FilterChip(selected = filter == null, onClick = { filter = null }, label = { Text("All") })
                Priority.entries.reversed().forEach { priority ->
                    FilterChip(
                        selected = filter == priority,
                        onClick = { filter = priority },
                        label = { Text(priority.label) },
                    )
                }
            }
        }
        if (visible.isEmpty()) {
            item { EmptyCard("No tasks in this lane.", "Use Quick Capture to create one.") }
        } else {
            items(visible, key = { it.id }) { task -> TaskRow(task, onToggleTask, onDeleteTask) }
        }
    }
}

@Composable
internal fun WeeklyPlanScreen(tasks: List<EchironTask>, onToggleTask: (String) -> Unit) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp, 16.dp, 16.dp, 120.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        item { Text("Seven-day plan", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.ExtraBold) }
        DayKey.entries.forEach { day ->
            val dayTasks = tasks.filter { it.dueDay == day }
            item { Text(day.name.lowercase().replaceFirstChar { it.uppercase() }, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
            if (dayTasks.isEmpty()) {
                item { Text("No tasks planned.", color = MaterialTheme.colorScheme.onSurfaceVariant) }
            } else {
                items(dayTasks, key = { it.id }) { task -> TaskRow(task, onToggleTask, null) }
            }
        }
    }
}

@Composable
internal fun TaskRow(
    task: EchironTask,
    onToggle: (String) -> Unit,
    onDelete: ((String) -> Unit)?,
) {
    Card(
        modifier =
            Modifier
                .fillMaxWidth()
                .semantics {
                    contentDescription =
                        "${task.title}, ${task.priority.label} priority, " +
                            if (task.completed) "completed" else "not completed"
                },
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Checkbox(checked = task.completed, onCheckedChange = { onToggle(task.id) })
            Column(Modifier.weight(1f)) {
                Text(task.title, fontWeight = FontWeight.Bold)
                Text(
                    buildString {
                        append(task.category)
                        task.dueDay?.let { append(" • ${it.label}") }
                    },
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            AssistChip(onClick = {}, label = { Text(task.priority.label) })
            if (onDelete != null) {
                IconButton(onClick = { onDelete(task.id) }) {
                    Icon(Icons.Default.Delete, contentDescription = "Delete ${task.title}")
                }
            }
        }
    }
}
