package com.mgatzwei.SpotBroo;

import android.content.Context;
import android.content.SharedPreferences;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.util.Log;

public class SharedPreferencesModule extends ReactContextBaseJavaModule {
  private static final String PREFERENCES_FILE = "MyAppPreferences";

  public SharedPreferencesModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "SharedPreferences";
  }

  @ReactMethod
  public void setItem(String key, String value) {
    Log.d("SpotBrooOverview", "setItem");
    SharedPreferences preferences = getReactApplicationContext().getSharedPreferences(PREFERENCES_FILE, Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = preferences.edit();
    editor.putString(key, value);
    editor.apply();
  }

  @ReactMethod
  public void getItem(String key, Callback callback) {
    Log.d("SpotBrooOverview", "getItem");
    SharedPreferences preferences = getReactApplicationContext().getSharedPreferences(PREFERENCES_FILE, Context.MODE_PRIVATE);
    String value = preferences.getString(key, null);
    callback.invoke(value);
  }
}