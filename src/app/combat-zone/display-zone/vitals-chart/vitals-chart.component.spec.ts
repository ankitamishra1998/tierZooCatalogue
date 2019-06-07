import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsChartComponent } from './vitals-chart.component';

describe('VitalsChartComponent', () => {
  let component: VitalsChartComponent;
  let fixture: ComponentFixture<VitalsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
