import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SpotifyService } from '../../services/spotify.service';
import { HomeComponent } from './home.component';

describe('HomeComponent loading failures', () => {
  let spotify: { getNewReleases: jasmine.Spy };

  beforeEach(async () => {
    spotify = { getNewReleases: jasmine.createSpy('getNewReleases') };
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [HomeComponent],
      providers: [{ provide: SpotifyService, useValue: spotify }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('shows an expired session message when Spotify returns 401', () => {
    spotify.getNewReleases.and.returnValue(throwError({ status: 401 }));
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('La sesión de Spotify venció');
    expect(fixture.nativeElement.querySelector('app-loading')).toBeNull();
  });

  it('handles connection errors without assuming a Spotify error body', () => {
    spotify.getNewReleases.and.returnValue(throwError({ status: 0 }));
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('Comprueba tu conexión');
  });

  it('shows an empty state when no releases are returned', () => {
    spotify.getNewReleases.and.returnValue(of([]));
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent)
      .toContain('No hay lanzamientos');
  });
});
