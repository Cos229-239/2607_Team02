package com.flameborne.echiron.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.weight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.flameborne.echiron.model.EchironState
import com.flameborne.echiron.model.EncouragementCatalog
import com.flameborne.echiron.model.EncouragementLength
import com.flameborne.echiron.model.EncouragementPreferences
import com.flameborne.echiron.model.EncouragementTone
import com.flameborne.echiron.model.MomentumCalculator

@Composable
internal fun OnboardingScreen(onContinue: (String) -> Unit) {
    var name by rememberSaveable { mutableStateOf("") }
    Box(
        modifier =
            Modifier
                .fillMaxSize()
                .background(
                    Brush.linearGradient(
                        listOf(MaterialTheme.colorScheme.primary, MaterialTheme.colorScheme.secondary),
                    ),
                )
                .padding(24.dp),
        contentAlignment = Alignment.Center,
    ) {
        Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(24.dp)) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Text("ECHIRON", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.ExtraBold)
                Text("Begin with your name.", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Text(
                    "ECHIRON recognizes effort, protects agency, and helps the next honest action become visible.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Preferred name") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                Button(
                    onClick = { onContinue(name) },
                    enabled = name.isNotBlank(),
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("Enter ECHIRON") }
            }
        }
    }
}

@Composable
internal fun DashboardScreen(
    state: EchironState,
    onAddTask: () -> Unit,
    onToggleTask: (String) -> Unit,
    onFocus: (Int) -> Unit,
) {
    val active = state.tasks.filterNot { it.completed }
    val topTasks = active.sortedByDescending { it.priority.weight }.take(3)
    val latestSignal = state.encouragementHistory.firstOrNull()

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp, 16.dp, 16.dp, 120.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            Text("TODAY", color = MaterialTheme.colorScheme.secondary, fontWeight = FontWeight.Bold)
            Text(
                "Keep moving, ${state.profile.preferredName}.",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.ExtraBold,
            )
            Text(
                "One honest step still counts. Choose the next good action.",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        item { MomentumCard(state) }
        item {
            OutlinedCard {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Column(Modifier.weight(1f)) {
                        Text("Protect 25 minutes", fontWeight = FontWeight.Bold)
                        Text("Record a distraction-free focus block.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Button(onClick = { onFocus(25) }) { Text("Record focus") }
                }
            }
        }
        item { SectionHeader("Next actions", "Add task", onAddTask) }
        if (topTasks.isEmpty()) {
            item { EmptyCard("Your next-action lane is clear.", "Capture the next thing worth moving forward.") }
        } else {
            items(topTasks, key = { it.id }) { task -> TaskRow(task, onToggleTask, null) }
        }
        item { Text("Today’s encouragement", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
        item {
            Card {
                Column(Modifier.padding(16.dp)) {
                    Text(latestSignal?.heading ?: "Progress without punishment", fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(4.dp))
                    Text(
                        latestSignal?.message
                            ?: "ECHIRON records completed actions and focused time—not your worth. Reset, return, and take the next good step.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}

@Composable
private fun MomentumCard(state: EchironState) {
    val open = state.tasks.count { !it.completed }
    val wins = state.tasks.count { it.completed }
    Card {
        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.horizontalGradient(
                            listOf(MaterialTheme.colorScheme.primary, MaterialTheme.colorScheme.secondary),
                        ),
                    )
                    .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text("Momentum score", color = MaterialTheme.colorScheme.onPrimary)
            Text(
                MomentumCalculator.score(state).toString(),
                style = MaterialTheme.typography.displayMedium,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onPrimary,
            )
            Text("$open open tasks • $wins completed • ${state.focusMinutes} focus minutes", color = MaterialTheme.colorScheme.onPrimary)
            Text("Progress becomes momentum when it is seen.", color = MaterialTheme.colorScheme.onPrimary)
        }
    }
}

@Composable
internal fun ProgressScreen(state: EchironState) {
    val completed = state.tasks.count { it.completed }
    val open = state.tasks.size - completed
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp, 16.dp, 16.dp, 120.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item { Text("Progress", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.ExtraBold) }
        item {
            MetricGrid(
                listOf(
                    "Momentum" to MomentumCalculator.score(state).toString(),
                    "Completed" to completed.toString(),
                    "Open" to open.toString(),
                    "Focus minutes" to state.focusMinutes.toString(),
                ),
            )
        }
        item {
            Card {
                Column(Modifier.padding(16.dp)) {
                    Text("Your work is evidence", fontWeight = FontWeight.Bold)
                    Text(
                        "ECHIRON keeps progress local to this device and turns completed action into visible momentum.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}

@Composable
internal fun EncouragementScreen(
    state: EchironState,
    onSave: (String) -> Unit,
    onDismiss: (String) -> Unit,
    onAnother: (String) -> Unit,
    onUpdatePreferences: (EncouragementPreferences) -> Unit,
) {
    val preferences = state.encouragementPreferences
    val visibleHistory = state.encouragementHistory.filterNot { it.dismissed }
    val sourceCount = EncouragementCatalog.principles.map { it.sourceId }.toSet().size
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp, 16.dp, 16.dp, 120.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        item {
            Text("Encouragement engine", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.ExtraBold)
            Text(
                "${EncouragementCatalog.principles.size} compassionate principles • $sourceCount sources • fully local",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        item {
            Card {
                Column(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Text("Voice", fontWeight = FontWeight.Bold)
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(EncouragementTone.entries) { tone ->
                            FilterChip(
                                selected = preferences.tone == tone,
                                onClick = { onUpdatePreferences(preferences.copy(tone = tone)) },
                                label = { Text(tone.name.lowercase().replaceFirstChar { it.uppercase() }) },
                            )
                        }
                    }
                    Text("Message depth", fontWeight = FontWeight.Bold)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        EncouragementLength.entries.forEach { length ->
                            FilterChip(
                                selected = preferences.length == length,
                                onClick = { onUpdatePreferences(preferences.copy(length = length)) },
                                label = { Text(length.name.lowercase().replaceFirstChar { it.uppercase() }) },
                            )
                        }
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Column(Modifier.weight(1f)) {
                            Text("Spiritual language", fontWeight = FontWeight.Bold)
                            Text("Optional and off by default", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Switch(
                            checked = preferences.spiritualEnabled,
                            onCheckedChange = {
                                onUpdatePreferences(preferences.copy(spiritualEnabled = it))
                            },
                        )
                    }
                }
            }
        }
        item { Text("Recent signals", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }
        if (visibleHistory.isEmpty()) {
            item { EmptyCard("No signals yet.", "Complete a task or record a focus block.") }
        } else {
            items(visibleHistory, key = { it.id }) { record ->
                OutlinedCard {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        Text(record.heading, fontWeight = FontWeight.Bold)
                        Text(
                            "${record.principleTitle} • ${record.principleSource}",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.secondary,
                        )
                        Text(record.message, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            TextButton(onClick = { onSave(record.id) }) {
                                Text(if (record.saved) "Saved" else "Save")
                            }
                            TextButton(onClick = { onAnother(record.id) }) { Text("Another") }
                            TextButton(onClick = { onDismiss(record.id) }) { Text("Dismiss") }
                        }
                    }
                }
            }
        }
    }
}
