import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { RouterModule } from "@angular/router";

import { environment } from "./environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { PlaybarComponent } from "./playbar/playbar.component";
import { Playbar1Component } from "./playbar1/playbar1.component";
import { Playbar2Component } from "./playbar2/playbar2.component";
import { SongService } from "./song.service";
import { FirebaseService } from "./firebase.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    RouterModule.forRoot([
      {
        path: "",
        component: PlaybarComponent
      },
      { path: "playbar1", component: Playbar1Component },
      { path: "playbar2", component: Playbar2Component }
    ])
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    PlaybarComponent,
    Playbar1Component,
    Playbar2Component
  ],
  bootstrap: [AppComponent],
  providers: [AngularFirestore, SongService, FirebaseService]
})
export class AppModule {}
