import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BuildsService } from '../../../services/builds.service';
import { Build } from '../../header/build.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-display-zone',
  templateUrl: './display-zone.component.html',
  styleUrls: ['./display-zone.component.css']
})
export class DisplayZoneComponent implements OnInit, OnDestroy {
  builds: Build[] = [];
  imagePreview: string = '../assets/placeholder.png';
  buildImage: File;
  private buildsSubscription: Subscription;

  constructor(public buildsService: BuildsService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.buildsService.getBuilds();
    this.buildsSubscription = this.buildsService.listenToBuildsUpdate()
      .subscribe((builds: Build[]) => {
            this.builds = builds;
      });
  }


  ngOnDestroy() {
    this.buildsSubscription.unsubscribe();
  }

  onAddImage(event: Event, build: Build){
    const file = (event.target as HTMLInputElement).files[0];
    this.buildImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      build.image = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log("Image url: ", build.image);
    this.buildsService.addImage(build, this.buildImage);
  }

  onShowNotes(id: string){
    const dialogRef = this.dialog.open(ShowNotesDialogComponent, {
      width: '600px',
      data: {
        id: id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onDeleteBuild(buildId: string){
    this.buildsService.deleteBuild(buildId);
  }

}

@Component({
  selector: 'app-show-notes-dialog',
  templateUrl: './showNotes.component.html',
  styleUrls: ['./showNotes.component.css']
})
export class ShowNotesDialogComponent implements OnInit{
  buildSelected: Build[] = [];
  private buildSelectedSubscription: Subscription;
  facts: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShowNotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public buildsService: BuildsService) {}


    ngOnInit() {
      console.log(this.data.id);
      this.buildsService.getBuild(this.data.id);
      this.buildSelectedSubscription = this.buildsService.listenToBuildsSelected()
        .subscribe((buildSelected: Build[]) => {
              this.buildSelected = buildSelected;
              this.facts = buildSelected[0].facts;
              console.log(this.buildSelected);
              console.log("Facts: ", this.facts);
        });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    onAddFact(factForm: NgForm){
      console.log(factForm.value);
      if (this.facts === null) {
        this.facts = [];
        this.facts.push(factForm.value.fact);
      } else {
        this.facts.push(factForm.value.fact);
      }

      const build : Build = {
        id: this.data.id,
        mapId: this.buildSelected[0].mapId,
        containerId: this.buildSelected[0].containerId,
        countryCode: this.buildSelected[0].countryCode,
        name: this.buildSelected[0].name,
        intelligence: this.buildSelected[0].intelligence,
        power: this.buildSelected[0].power,
        defense: this.buildSelected[0].defense,
        mobility: this.buildSelected[0].mobility,
        health: this.buildSelected[0].health,
        stealth: this.buildSelected[0].stealth,
        tier: this.buildSelected[0].tier,
        location: this.buildSelected[0].location,
        facts: this.facts,
        image: this.buildSelected[0].image
      };
      console.log(build);
      this.buildsService.addFact(build);
      factForm.reset();
    }
}
