import { Injectable } from '@angular/core';
import { Build } from '../app/header/build.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuildsService {
  private builds: Build[] = [];
  private build: Build[] = [] ;
  countryData: any;

  private buildsUpdated = new Subject<Build[]>();
  private buildSelected = new Subject<Build[]>();

  constructor(private http: HttpClient) { }

  getBuilds() {
    this.http.get<{message: string, builds: any}>('http://localhost:3000/api/builds').pipe(map((data) => {
        return data.builds.map((build) => {
          return {
            id: build._id,
            mapId: build.mapId,
            containerId: build.containerId,
            countryCode: build.countryCode,
            name: build.name,
            intelligence: build.intelligence,
            power: build.power,
            defense: build.defense,
            mobility: build.mobility,
            health: build.health,
            stealth: build.stealth,
            tier: build.tier,
            location: build.location,
            facts: build.facts,
            image: build.image
          };
        });
    }))
      .subscribe((changedData) => {
        this.builds = changedData;
        this.buildsUpdated.next([...this.builds]);
      });
  }

  getBuild(id: string) {
    this.http.get<{message: string, builds: any}>('http://localhost:3000/api/builds/' + id)
      .subscribe((changedData) => {
        this.build = changedData.builds;
        this.buildSelected.next([...this.build]);
      });


  }

  sortByVitals(vital: string) {
    let sortedBuilds = [];
    if ( vital === 'intelligence') {
      sortedBuilds = this.builds.sort((a, b) => {
        return b.intelligence - a.intelligence;
      });
    } else if ( vital === 'power') {
      sortedBuilds = this.builds.sort((a, b) => {
        return b.power - a.power;
      });
    } else if ( vital === 'defense' ) {
      sortedBuilds = this.builds.sort((a, b) => {
        return b.defense - a.defense;
      });
    } else if ( vital === 'mobility' ) {
      sortedBuilds = this.builds.sort((a, b) => {
        return b.mobility - a.mobility;
      });
    } else if ( vital === 'health' ) {
      sortedBuilds = this.builds.sort((a, b) => {
        return b.health - a.health;
      });
    } else {
      sortedBuilds = this.builds.sort((a, b) => {
        return b.stealth - a.stealth;
      });
    }
    this.buildsUpdated.next([...sortedBuilds]);
  }

  filterByTier(tier: string) {
    const filteredBuilds = this.builds.filter(
      build => build.tier === tier);
    this.buildsUpdated.next([...filteredBuilds]);
  }

  filterByLocation(location: string) {
    const filteredBuilds = this.builds.filter(
      build => build.location === location);
    this.buildsUpdated.next([...filteredBuilds]);
  }

  reset() {
    this.buildsUpdated.next([...this.builds]);
  }

  listenToBuildsUpdate(){
    return this.buildsUpdated.asObservable();
  }

  listenToBuildsSelected(){
    return this.buildSelected.asObservable();
  }

  addFact(build: Build) {
    console.log(build);
    this.http.put<{message: string, buildId: string}>('http://localhost:3000/api/builds/' + build.id, build)
        .subscribe((result) => {
          console.log(result);
        });
  }

  addImage(build: Build, image: File) {
    const buildData = new FormData();
    buildData.append("id", build.id);
    buildData.append("mapId", build.mapId);
    buildData.append("containerId", build.containerId);
    buildData.append("countryCode", build.countryCode);
    buildData.append("name", build.name);
    buildData.append("intelligence", build.intelligence.toString());
    buildData.append("power", build.power.toString());
    buildData.append("defense", build.defense.toString());
    buildData.append("mobility", build.mobility.toString());
    buildData.append("health", build.health.toString());
    buildData.append("stealth", build.stealth.toString());
    buildData.append("tier", build.tier);
    buildData.append("location", build.location);
    buildData.append("facts", JSON.stringify(build.facts));
    buildData.append("image", build.image);
    buildData.append("buildImage", image);
    this.http.patch<{message: string, buildId: string}>('http://localhost:3000/api/builds/images/' + build.id, buildData)
        .subscribe((result) => {
          console.log(result);
        });
  }

  addBuild( name: string,
            intelligence: number,
            power: number,
            defense: number,
            mobility: number,
            health: number,
            stealth: number,
            tier: string,
            location: string,
            countryCode: string) {

      const facts: string[] = null;
      const build: Build = {
        id: null,
        mapId: null,
        containerId: null,
        countryCode: countryCode,
        name: name,
        intelligence: intelligence,
        power: power,
        defense: defense,
        mobility: mobility,
        health: health,
        stealth: stealth,
        tier: tier,
        location: location,
        facts: facts,
        image: '../assets/placeholder.png'
      };

      this.http.post<{message: string, buildId: string}>('http://localhost:3000/api/builds', build)
        .subscribe((result) => {
          const buildId = result.buildId;
          build.id = buildId;
          this.builds.push(build);
          this.buildsUpdated.next([...this.builds]);
        });
    }

    deleteBuild(buildId: string) {
      this.http.delete('http://localhost:3000/api/builds/' + buildId)
        .subscribe(()  => {
          const updatedBuilds = this.builds.filter(build => build.id !== buildId);
          this.builds = updatedBuilds;
          this.buildsUpdated.next([...this.builds]);
        });
    }

    getCountryData(){
      return this.http.get('http://localhost:4200/assets/countries.json')
      .subscribe((result) => {
        this.countryData = result;
      });
    }
}
