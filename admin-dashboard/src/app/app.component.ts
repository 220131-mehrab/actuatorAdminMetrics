import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SystemCpu } from './interface/system-cpu';
import { SystemHealth } from './interface/system-health';
import { AdminDashboardService } from './service/admin-dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public traceList: any[] = [];
  public selectedTrace: any;
  public systemHealth!: SystemHealth;
  public systemCpu!: SystemCpu;
  public processUptime!: string;
  public http200Traces: any[] = [];
  public http400Traces: any[] = [];
  public http404Traces: any[] = [];
  public http500Traces: any[] = [];
  public httpDefaultTraces: any[] = [];


  constructor(private adminDashboardService: AdminDashboardService){}

  ngOnInit(): void {
    this.getTraces();
    this.getCpuUsage();
    this.getSystemHealth();
  }


  private getTraces(): void {
    this.adminDashboardService.getHttpTraces().subscribe(
      (response: any) => {
        console.log(response.traces);
        this.processTraces(response.traces);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private getCpuUsage(): void {
    this.adminDashboardService.getSystemCpu().subscribe(
      (response: SystemCpu) => {
        console.log(response);
        this.systemCpu = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private getSystemHealth(): void {
    this.adminDashboardService.getSystemHealth().subscribe(
      (response: SystemHealth) => {
        console.log(response);
        this.systemHealth = response;
        this.systemHealth.details.diskSpace.details.free = this.formatBytes(this.systemHealth.details.diskSpace.details.free);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  private processTraces(traces: any): void {
    this.traceList = traces;
    this.traceList.forEach(trace => {
      switch(trace.response.status){
        case 200: 
          this.http200Traces.push(trace);
          break;
        case 400: 
          this.http400Traces.push(trace);
          break;
        case 404: 
          this.http404Traces.push(trace);
          break;
        case 500: 
          this.http500Traces.push(trace);
          break;
        default: 
          this.httpDefaultTraces.push(trace);
      }
    });
  }

  public onSelectTrace(trace: any): void {
    this.selectedTrace = trace;
    document.getElementById('trace-modal')?.click();
  }

  private formatBytes(bytes: any): string{
    if (bytes === 0){
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2 < 0 ? 0 : 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
