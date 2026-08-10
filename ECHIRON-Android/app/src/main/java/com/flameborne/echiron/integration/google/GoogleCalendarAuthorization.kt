package com.flameborne.echiron.integration.google

import android.app.Activity
import android.content.Intent
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.IntentSenderRequest
import com.google.android.gms.auth.api.identity.AuthorizationRequest
import com.google.android.gms.auth.api.identity.AuthorizationResult
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.api.Scope

object GoogleCalendarAuthorization {
    const val CALENDAR_READONLY_SCOPE = "https://www.googleapis.com/auth/calendar.readonly"

    private val requestedScopes = listOf(Scope(CALENDAR_READONLY_SCOPE))

    fun authorize(
        activity: Activity,
        resolutionLauncher: ActivityResultLauncher<IntentSenderRequest>,
        onAuthorized: (AuthorizationResult) -> Unit,
        onError: (Throwable) -> Unit,
    ) {
        val request = AuthorizationRequest.builder()
            .setRequestedScopes(requestedScopes)
            .build()

        val client = Identity.getAuthorizationClient(activity)
        client.authorize(request)
            .addOnSuccessListener { result ->
                if (result.hasResolution()) {
                    val pendingIntent = result.pendingIntent
                    if (pendingIntent != null) {
                        resolutionLauncher.launch(
                            IntentSenderRequest.Builder(pendingIntent.intentSender).build(),
                        )
                    } else {
                        onError(IllegalStateException("Google authorization required a resolution, but no PendingIntent was returned."))
                    }
                } else {
                    onAuthorized(result)
                }
            }
            .addOnFailureListener(onError)
    }

    fun resultFromIntent(activity: Activity, data: Intent?): AuthorizationResult {
        requireNotNull(data) { "Google authorization returned no result Intent." }
        return Identity.getAuthorizationClient(activity)
            .getAuthorizationResultFromIntent(data)
    }
}
