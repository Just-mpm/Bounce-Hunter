# Regras ProGuard para Bounce Hunter

# Manter classes do Capacitor
-keep class com.getcapacitor.** { *; }
-keep class com.ionicframework.** { *; }

# Manter WebView
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
}

# Manter JavaScript Interface
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Otimizações gerais
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-verbose

# Manter recursos do Capacitor
-keep class com.capacitorjs.** { *; }
-keep @com.capacitor.annotation.CapacitorPlugin public class * {
    @com.capacitor.annotation.PermissionCallback <methods>;
    @com.capacitor.annotation.ActivityCallback <methods>;
    @com.capacitor.annotation.PluginMethod public <methods>;
}

# Manter classes de plugins
-keep public class * extends com.capacitorjs.Plugin

# Suprimir warnings
-dontwarn com.google.common.**
-dontwarn com.google.errorprone.annotations.**
-dontwarn javax.annotation.**
-dontwarn sun.misc.Unsafe