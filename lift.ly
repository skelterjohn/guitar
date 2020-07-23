\version "2.18.2"
\header {
  title = "lift"
  composer = "John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

#(set-global-staff-size 25)

<<
  \time 3/4
  \partial 4
  \new Staff {
    \clef "treble_8"
    \key d \major
    r4 |
    % 1
    r2. | r2. |
    r2. | r2. | \break
    % 5
    \bar ".|:" fis'2 e'4 | fis'2 b'4 |
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
  }
  \new Staff {
    \clef "treble_8"
    \key d \major
    \set stringNumberOrientations = #'(down)
    \set fingeringOrientations = #'(left)
    <gis d' fis' e'-0>4\fermata | 
    % 1
    <b\4>8 d'\3 fis'\2 e'\1 fis'4 | gis8 d' fis' e' fis'4 | 
    b8 d' fis' e' fis'4 | gis8 d' fis' e' fis'4 | 
    % 5
    b8 d' fis' e' fis' e' | gis8 d' fis' e' fis' e' | 
    b8 d' fis' e' fis' e' | gis8 d' fis' e' fis' e' | 
    % 9
    b8 d' fis' e' fis' e' | gis8 d' fis' e' fis' e' | 
    b8 d' fis' e' fis' e' | gis8 d' fis' e' fis' e' |
    % 13
    <a\4>8 cis'\3 e'\2 e'\1 e'\2 cis'\3 | a8 cis' e' e' e' cis' |
    a8 cis' e' e' e' cis' | a8 d' fis' e' fis' e' |
    % 17
    b8 d' fis' e' fis' e' | gis8 d' fis' e' fis' e' | 
    b8 d' fis' e' fis' e' | gis8 d' fis' e' fis' e' |
    % 21
    a8 cis' e' e' e' cis' | a8 cis' e' e' e' cis' |
    a8 cis' e' e' e' cis' | g8 b d' e' d' b |
    % 25
    fis8 b d' e' d' b | d8 b d' e' <g d'> b |
    fis8 b d' e' d' b | b,8 b d' e' d' b |
    % 29
    fis8 b d' e' <e d'> b | d8 b d' e' <e d'> b |
    fis8 b d' e' d' b | fis8 b d' e' <g d'> b |
    % 33
    a8 c' fis' e' <g fis'> c' | fis8 c' fis' e' <g fis'> c' |
    a8 c' fis' e' fis' c' | a8 c' fis' e' fis' c' |
    % 37
    e8 b g' e' g' b |
  }
>>