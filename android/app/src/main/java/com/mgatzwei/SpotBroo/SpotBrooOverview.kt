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
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)

        Log.d("SpotBrooOverview", "MGW onrecived")

        if (AppWidgetManager.ACTION_APPWIDGET_UPDATE == intent.action) {
            Log.d("SpotBrooOverview", "MGW TYPE Update "+SystemClock.elapsedRealtime())
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(ComponentName(context, SpotBrooOverview::class.java))
            for (appWidgetId in appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId)
            }
            val type = intent.getStringExtra("update_type")
            Log.d("SpotBrooOverview", "MGW Update --> " + type)
            if(type == "automatic"){
                Log.d("SpotBrooOverview", "MGW TYPE Update -------------- automatic")
                scheduleNextUpdate(context)
            }

        }
        if (Intent.ACTION_BOOT_COMPLETED == intent.action) {
            Log.d("SpotBrooOverview", "Device rebooted, rescheduling updates")
            scheduleNextUpdate(context)
        }
    }

    override fun onEnabled(context: Context) {
        Log.d("SpotBrooOverview", "MGW Widget onEnabled called")
        scheduleNextUpdate(context)
    }

    override fun onDisabled(context: Context) {
        Log.d("SpotBrooOverview", "MGW Widget onDisabled called")
        cancelScheduledUpdate(context)
    }

    private fun scheduleNextUpdate(context: Context) {
        Log.d("SpotBrooOverview", "MGW Scheduling next update")
        val updateIntent = getAutomaticUpdateIntent(context)
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        // Use setExactAndAllowWhileIdle for precise updates even in Doze Mode
        try {
            val alarmTime = SystemClock.elapsedRealtime() + 60000
            Log.d("SpotBrooOverview", " MGW CurrenTime in Schedular:" + SystemClock.elapsedRealtime())
            Log.d("SpotBrooOverview", " MGW Attempting to schedule alarm for $alarmTime (elapsed realtime)")
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.ELAPSED_REALTIME_WAKEUP,
                SystemClock.elapsedRealtime() + 60000, // 1 minute
                updateIntent
            )
        } catch (e: SecurityException) {
            Log.e("SpotBrooOverview", "MGW Failed to schedule exact alarm: ${e.message}")
        }
    }

    private fun cancelScheduledUpdate(context: Context) {
        Log.d("SpotBrooOverview", "MGW Cancelling scheduled update indeed")
        val updateIntent = getAutomaticUpdateIntent(context)
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.cancel(updateIntent)
    }
}

internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    Log.d("SpotBrooOverview", "MGW really Updating widget with ID: $appWidgetId")
    val sharedPreferences: SharedPreferences = context.getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
    val currentPrice = sharedPreferences.getString("currentPrice", "undefined")
    val settingsUnit = sharedPreferences.getString("settingsUnit", "MWh")
    Log.d("SpotBrooOverview", "MGW Got Price with: $currentPrice")

    val now = Calendar.getInstance()
    val hourFormat = SimpleDateFormat("HH", Locale.getDefault())
    val currentHour = hourFormat.format(now.time)

    val views = RemoteViews(context.packageName, R.layout.spot_broo_overview)
    views.setTextViewText(R.id.appwidget_title, "SpotBroo")
    views.setTextViewText(R.id.appwidget_hour, "Hour: $currentHour")
    views.setTextViewText(R.id.appwidget_price, "Price: $currentPrice / $settingsUnit")

    //This makes it able to update the View onCLick!
    /*val updateIntent = getManualUpdateIntent(context)
    views.setOnClickPendingIntent(R.id.appwidget_layout, updateIntent)*/

    val appLaunchIntent = getAppLaunchIntent(context)
    views.setOnClickPendingIntent(R.id.appwidget_layout, appLaunchIntent)

    appWidgetManager.updateAppWidget(appWidgetId, views)
}


fun getAutomaticUpdateIntent(context: Context): PendingIntent {
    val uniqueRequestCode = SystemClock.elapsedRealtime().toInt()
    val intent = Intent(context, SpotBrooOverview::class.java)
    intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
    intent.putExtra("update_type", "automatic")
    val updatePendingIntent = PendingIntent.getBroadcast(
        context,
        uniqueRequestCode,
        intent,
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE else PendingIntent.FLAG_UPDATE_CURRENT
    )
    return updatePendingIntent
}

fun getManualUpdateIntent(context: Context): PendingIntent {
    val intent = Intent(context, SpotBrooOverview::class.java)
    intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
    intent.putExtra("update_type", "manual")
    val updatePendingIntent = PendingIntent.getBroadcast(
        context,
        0,
        intent,
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE else PendingIntent.FLAG_UPDATE_CURRENT
    )
    return updatePendingIntent
}

private fun getAppLaunchIntent(context: Context): PendingIntent {
    // Create an Intent to launch the app's MainActivity
    val intent = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
    }

    // Wrap the Intent in a PendingIntent
    return PendingIntent.getActivity(
        context,
        0,
        intent,
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }
    )
}