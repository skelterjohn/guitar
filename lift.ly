\version "2.18.2"
\header {
  title = "Lift"
  composer = "John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

#(set-global-staff-size 25)

<<
  \time 3/4
  \partial 4
  
  \chords {
    b4:m
  }
  
  \new Staff \with {
    instrumentName = #"Flute "
    shortInstrumentName = #"flt. "
  }
  {
    \clef "treble_8"
    \key d \major
    r4 |
    % 1
    r2. | r2. |
    r2. | r2. | \break
    % 5
    \bar ".|:" fis'2 g'4 | fis'2 b'4 |
    cis''2 d''4 | cis''2. | \break
    % 9
    fis'2 e'4 | fis'4 e' d' |
    cis'2. | r2. | \break
    % 13
    e'4 e' e' | e'2 r4 |
    e'4 e' fis' | g'4 fis' e' |  \break
    % 17
    fis'2. | r2. |
    r2. | r2. | \bar ":|." \break
    % 21
    r2. | r2. |
    r2. | r2. | \break 
    % 25
    r2. | r2. |
    r2. | r2. | \break 
    % 29
    r2. | r2. |
    r2. | r2. | \break 
    % 33
    r2. | r2. |
    r2. | r2. | \break 
  }
  
  \new Staff \with {
    instrumentName = #"Cello "
    shortInstrumentName = #"cel. "
  }
  {
    \clef "treble_8"
    \key d \major
    r4 |
    % 1
    r2. | r2. |
    r2. | r2. | \break
    % 5
    d2.~ | d2. |
    fis2.~ | fis2. | \break
    % 9
    d2.~ | d2. |
    g4. fis8 e d | cis4 d e | \break
    % 13
    cis2.~ | cis2. |
    cis2. | d2. | \break
    % 17
    d2. | r2. |
    r2. | r2. | \break
  }
  
  \new Staff \with {
    instrumentName = #"Guitar "
    shortInstrumentName = #"gtr. "
  } {
    \clef "treble_8"
    \key d \major
    \set stringNumberOrientations = #'(down)
    \set fingeringOrientations = #'(left)
    <gis d' fis' e'-0>4\fermata |
    <<
    \new Voice { \voiceOne
      % 1
      <b\4>8 d'\3 fis'\2 e'\1 fis'4 | gis8 d' fis' e' fis'4 | 
      b8 d' fis' e' fis'4 | gis8 d' fis' e' fis'4 | 
      % 5
      b8 d' fis' e' fis' d' | gis8 d' fis' e' fis' d' | 
      b8 d' fis' e' fis' d' | gis8 d' fis' e' fis' d' | 
      % 9
      b8 d' fis' e' fis' d' | gis8 d' fis' e' fis' d' | 
      b8 d' fis' e' fis' d' | gis8 d' fis' e' fis' d' |
      % 13
      <a\4>8 cis'\3 e'\2 e'\1 e'\2 cis'\3 | a8 cis' e' e' e' cis' |
      a8 cis' e' e' e' cis' | a8 d' fis' e' fis' d' |
      % 17
      b8 d' fis' e' fis' d' | gis8 d' fis' e' fis' d' | 
      b8 d' fis' e' fis' d' | gis8 d' fis' e' fis' d' |
      % 21
      a8 cis' e' e' e' cis' | a8 cis' e' e' e' cis' |
      a8 cis' e' e' e' cis' | g8 b d' e' d' b |
      % 25
      fis8 b d' e' d' b | d8 b d' e' d' b |
      fis8 b d' e' d' b | b,8 b d' e' d' b |
      % 29
      fis8 b d' e' d' b | d8 b d' e' d' b |
      fis8 b d' e' d' b | fis8 b d' e' d' b |
      % 33
      a8 c' fis' e' fis' c' | fis8 c' fis' e' fis' c' |
      e8 c' fis' e' fis' c' | e8 c' fis' e' fis' c' |
      % 37
      e8 b g' e' g' b | e8 b g' e' g' b |
      e8 b g' e' g' b | e8 b g' e' g' b |
      % 41
      c8 c' a' e' a' c' | c8 c' a' e' a' c' |
      c8 c' a' e' a' c' | c8 c' a' e' a' c' |
      % 45
      b,8 b a' e' a' b | b,8 b a' e' a' b |
      b,8 b a' dis'\3 a' b | b,8 b a' dis' a' b |
    }
    \new Voice { \voiceTwo
      % 1
      b4 s2 | gis2. |
      b2. | gis2. |
      % 5
      b2. | gis2. |
      b2. | gis2. |
      % 9
      b2. | gis2. |
      b2. | gis2. |
      % 13
      a2. | a2. |
      a2. | a2. |
      % 17
      b2. | gis2. |
      b2. | gis2. |
      % 21
      a2. | a2. |
      a2. | g2. |
      % 24
      fis2. | d2. |
      fis2. | b,2. |
      % 29
      fis2. | d2. |
      fis2. | fis2. |
      % 33
      a2. | fis2. |
      e2. | e2. |
      % 37
      e2. | e2. |
      e2. | e2. |
      % 41
      c2. | c2. |
      c2. | c2. |
      % 45
      b,2. | b,2. |
      b,2. | b,2. |
    }
    >>
  }
>>