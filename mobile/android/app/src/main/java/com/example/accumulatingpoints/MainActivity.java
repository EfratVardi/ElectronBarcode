package com.example.accumulatingpoints;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // הפעלת מצב Kiosk (נעילת האפליקציה)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            DevicePolicyManager dpm = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
            ComponentName adminComponent = new ComponentName(this, MyAdminReceiver.class);

            if (dpm != null && dpm.isDeviceOwnerApp(getPackageName())) {
                // מאפשר לאפליקציה להיות היחידה שרצה
                dpm.setLockTaskPackages(adminComponent, new String[]{getPackageName()});
            }

            startLockTask(); // מפעיל נעילה
        }

        // הפעלת מצב מסך מלא
        hideSystemUI();
    }

 @Override
    public void onResume() {
        super.onResume(); // חשוב לקרוא לפונקציה של המחלקה העליונה
        hideSystemUI();
    }


    // פונקציה להחבאת הניווט התחתון, הסטטוס בר וכפתורי החזרה
    private void hideSystemUI() {
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
        );
    }

    @Override
    public void onBackPressed() {
        // חוסם את כפתור "חזרה"
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_HOME || 
            keyCode == KeyEvent.KEYCODE_APP_SWITCH || 
            keyCode == KeyEvent.KEYCODE_VOLUME_UP || 
            keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            return true; // חוסם כפתורים
        }
        return super.onKeyDown(keyCode, event);
    }
}
