package com.mgatzwei.SpotBroo

import android.app.AlarmManager
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Build
import android.os.SystemClock
import android.util.Log
import android.widget.RemoteViews
import java.text.SimpleDateFormat
import java.util.*

class SpotBrooOverview : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        Log.d("SpotBrooOverview", "Widget onUpdate called")
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
        scheduleNextUpdate(context)
    }

    override fun onEnabled(context: Context) {
        Log.d("SpotBrooOverview", "Widget onEnabled called")
        scheduleNextUpdate(context)
    }

    override fun onDisabled(context: Context) {
        Log.d("SpotBrooOverview", "Widget onDisabled called")
        cancelScheduledUpdate(context)
    }

    private fun scheduleNextUpdate(context: Context) {
        Log.d("SpotBrooOverview", "Scheduling next update")
        val intent = Intent(context, SpotBrooOverview::class.java)
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        val pendingIntent = PendingIntent.getBroadcast(
            context, 
            0, 
            intent, 
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE else PendingIntent.FLAG_UPDATE_CURRENT
        )
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.setRepeating(
            AlarmManager.ELAPSED_REALTIME,
            SystemClock.elapsedRealtime() + 60000, // 1 minute
            60000, // 1 minute
            pendingIntent
        )
    }

    private fun cancelScheduledUpdate(context: Context) {
        Log.d("SpotBrooOverview", "Cancelling scheduled update")
        val intent = Intent(context, SpotBrooOverview::class.java)
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        val pendingIntent = PendingIntent.getBroadcast(
            context, 
            0, 
            intent, 
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE else PendingIntent.FLAG_UPDATE_CURRENT
        )
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.cancel(pendingIntent)
    }
}

internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    Log.d("SpotBrooOverview", "Updating widget with ID: $appWidgetId")
    val sharedPreferences: SharedPreferences = context.getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
    val currentPrice = sharedPreferences.getString("currentPrice", "Price: $0.00")
    Log.d("SpotBrooOverview", "Got Price with: $currentPrice")

    val now = Calendar.getInstance()
    val hourFormat = SimpleDateFormat("HH", Locale.getDefault())
    val currentHour = hourFormat.format(now.time)

    val views = RemoteViews(context.packageName, R.layout.spot_broo_overview)
    views.setTextViewText(R.id.appwidget_title, "SpotBroo")
    views.setTextViewText(R.id.appwidget_hour, "Hour: $currentHour")
    views.setTextViewText(R.id.appwidget_price, "Price: $currentPrice")

    val intent = Intent(context, SpotBrooOverview::class.java)
    intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
    val pendingIntent = PendingIntent.getBroadcast(
        context, 
        0, 
        intent, 
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE else PendingIntent.FLAG_UPDATE_CURRENT
    )
    views.setOnClickPendingIntent(R.id.appwidget_title, pendingIntent)

    appWidgetManager.updateAppWidget(appWidgetId, views)
}