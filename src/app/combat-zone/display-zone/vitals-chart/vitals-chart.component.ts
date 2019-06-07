import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Build } from '../../../header/build.model';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-vitals-chart',
  templateUrl: './vitals-chart.component.html',
  styleUrls: ['./vitals-chart.component.css']
})
export class VitalsChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart[] = [];
  @Input() build: Build;
  idArray: string[] = [];
  chartData = [];
  mapData = [];

  constructor() {

   }

  ngOnInit() {
    this.idArray = [];
    this.idArray.push(this.build.id);
    console.log("Container: ", this.idArray);
  }

  ngAfterViewInit() {
      var container = am4core.create(this.build.id, am4core.Container);
      container.width = am4core.percent(100);
      container.height = am4core.percent(100);
      container.layout = "horizontal";

      const intelligenceVital = {
        vital: 'Intelligence',
        value: this.build.intelligence
      };
      this.chartData.push(intelligenceVital);
      const powerVital = {
        vital: 'Power',
        value: this.build.power
      };
      this.chartData.push(powerVital);
      const defenseVital = {
        vital: 'Defense',
        value: this.build.defense
      };
      this.chartData.push(defenseVital);
      const mobilityVital = {
        vital: 'Mobility',
        value: this.build.mobility
      };
      this.chartData.push(mobilityVital);
      const healthVital = {
        vital: 'Health',
        value: this.build.health
      };
      this.chartData.push(healthVital);
      const stealthVital = {
        vital: 'Stealth',
        value: this.build.stealth
      };
      this.chartData.push(stealthVital);

      this.mapData = [{
      id: this.build.countryCode,
      name: this.build.location,
      value: 100,
      fill: am4core.color("#F05C5C")
    }];

      this.addChart(container, this.chartData, this.mapData);
  }

  addChart(container: any, chartData: any, mapData: any){

    var map = container.createChild(am4maps.MapChart);
    var chart = container.createChild(am4charts.XYChart);

    chart.data = chartData;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "vital";
    //categoryAxis.title.text = "Vitals";
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //valueAxis.title.text = "Units";

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.name = "Vital Stats";
    series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
    series.columns.template.fill = am4core.color("#104547");
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "vital";

    this.chart.push(chart);

    map.data = mapData;
    map.geodata = am4geodata_worldLow;
    map.projection = new am4maps.projections.Miller();
    var polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#74B266");

    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#367B25");

    polygonSeries.exclude = ["AQ"];

    polygonSeries.data = [{
      "id": this.build.countryCode,
      "name": this.build.location,
      "value": 100,
      "fill": am4core.color("#F05C5C")
    }];

    polygonTemplate.propertyFields.fill = "fill";
  }

  ngOnDestroy() {
      for(let item of this.chart){
        if (item) {
          item.dispose();
        }
      }
  }

}
