import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
// import IMQA from "@imqa/web-agent";

// IMQA.init({
//   serviceName: "OpenTelemetry Demo",
//   collectorUrl: "http://localhost:4318",
//   serviceKey: "servicekey",
//   serviceVersion: "1.0.0",
// });

@customElement("my-app")
export class MyApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f8fafc;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .header {
      text-align: center;
      margin-bottom: 3rem;
    }
    .title {
      font-size: 2.5rem;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 1rem;
    }
    .subtitle {
      color: #64748b;
      font-size: 1.125rem;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 1rem;
    }
    .button {
      background-color: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      width: 100%;
    }
    .button:hover {
      background-color: #2563eb;
    }
    .log-container {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .log-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .log-content {
      background: #f1f5f9;
      border-radius: 0.5rem;
      padding: 1rem;
      font-family: monospace;
      max-height: 400px;
      overflow-y: auto;
    }
    .log-entry {
      padding: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.875rem;
    }
    .log-entry:last-child {
      border-bottom: none;
    }
    .clear-button {
      background-color: #e2e8f0;
      color: #475569;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .clear-button:hover {
      background-color: #cbd5e1;
    }
  `;

  private logs: string[] = [];

  private async testFetch() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const data = await response.json();
      this.addLog("Fetch successful:", data);
    } catch (error) {
      this.addLog("Fetch error:", error);
    } finally {
    }
  }

  private testXHR() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/2");
    xhr.onload = () => {
      this.addLog("XHR successful:", JSON.parse(xhr.responseText));
    };
    xhr.onerror = (error) => {
      this.addLog("XHR error:", error);
    };
    xhr.send();
  }

  private testError() {
    console.error("Test error");
    try {
      throw new Error("Test error");
    } catch (error) {
      this.addLog("Error test:", error);
    }
  }

  private addLog(...args: any[]) {
    const timestamp = new Date().toISOString();
    this.logs = [...this.logs, `[${timestamp}] ${JSON.stringify(args)}`];
    this.requestUpdate();
  }

  private clearLogs() {
    this.logs = [];
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1 class="title">OpenTelemetry Demo</h1>
          <p class="subtitle">
            Test various instrumented operations and monitor their traces
          </p>
        </div>

        <div class="card-grid">
          <div class="card">
            <h2 class="card-title">Fetch API Test</h2>
            <p style="margin-bottom: 1rem">
              Test instrumented Fetch API call to external API
            </p>
            <button class="button" @click=${this.testFetch}>
              Run Fetch Test
            </button>
          </div>

          <div class="card">
            <h2 class="card-title">XMLHttpRequest Test</h2>
            <p style="margin-bottom: 1rem">
              Test instrumented XHR call to external API
            </p>
            <button class="button" @click=${this.testXHR}>Run XHR Test</button>
          </div>

          <div class="card">
            <h2 class="card-title">Error Test</h2>
            <p style="margin-bottom: 1rem">
              Generate and capture an error in traces
            </p>
            <button class="button" @click=${this.testError}>
              Generate Error
            </button>
          </div>
        </div>

        <div class="log-container">
          <div class="log-title">
            <span>Operation Logs</span>
            <button class="clear-button" @click=${this.clearLogs}>
              Clear Logs
            </button>
          </div>
          <div class="log-content">
            ${this.logs.map((log) => html`<div class="log-entry">${log}</div>`)}
          </div>
        </div>
      </div>
    `;
  }
}
