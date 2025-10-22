package com.adr1gr.pokedexvue;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onBackPressed() {
    getBridge().getWebView().post(() -> {
      getBridge().getWebView().evaluateJavascript(
        "window.dispatchEvent(new CustomEvent('androidBackPressed'))",
        null
      );
    });
  }
}
