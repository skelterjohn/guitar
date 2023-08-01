
\version "2.24.1"

\include "common.ly"

\header {
  title = "Allegro in E minor"
  composer = "Yassimba"
  tagline = "rev. J Asmuth"
}


notes={
  \key e \minor
  \time 6/8
  
  <<
    \new Voice{ \voiceOne 
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      <g''-1>8 b' ais' fis'' b' a' |
      dis'16( fis') a' c''( b') a' fis''8 b' a' |
      g'16 b' e'' fis'' g'' b'' e'''( b'') g'' e'' cis''( b') |
      a'8 e'16 cis''( b') a' fis' a' dis'' a' fis'' b' |
      g''8 b' ais' fis''  ais''16( \glissando b'') e'''8 |
      fis''8 b' a' b' ais''16( \glissando b'') dis'''8 |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e4. e' |
      dis'4. dis' |
      e2. |
      a4. b4 8 |
      e4. e |
      b4. b |
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne 
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e'''16( dis''') e''' d''' c''' b'' a'' a' c'' e'' c''' e'' |
      r16 b' e'' g'' b'' dis''' e'''4. |
      r16 b' c'' e'' a'' b'' c''' b'' a'' g'' fis'' e'' |
      r16 g'' fis'' d'' b' g' b'( c'') e'' g'' b''( c''') |
      r16 c'' e'' a'' fis'' e'' dis'' c'' b' a' g' fis' |
      e'16 b g' e' b' g' e'' gis'' f''' e''' d''' b'' |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e4. a |
      b4. e8 16 16 16 16 |
      a4. d4. |
      g4. c' |
      fis'4. b |
      e4. e |
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne 
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      c'''16 b' c'' e'' a'' b'' c'''( b'') a'' g'' fis'' e'' |
      dis''16 fis' a' dis'' fis'' dis'' b'' fis''( g'') dis'' e'' b' |
      r16 a' b' c''( b') a' dis'' ais'( b') dis'' fis'' dis'' |
      e''16 ais' b' c'' b' ais'' r ais' b' c'' b' ais' |
      b''4 g''8 a''8 8 8 |
      a''4 fis''8 g''8 8 8 |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      a4. a |
      c'4 b8 e4. |
      fis4. b |
      e4. e |
      e4. fis'4. |
      dis'4. e'8 e4 |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      s2. |
      s2. |
      s2. |
      s2. |
      \tweak Y-offset #0 r16 ais' b' c'' b' ais' \tweak Y-offset #1 r ais' b' c'' b' ais' |
      \tweak Y-offset #0.5 r16 ais' b' c'' b' ais' \tweak Y-offset #0.5 r \override Beam.positions = #'(-2.5 . -2.5) ais' b' c'' b' ais' |
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne 
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e''4 fis''8 g''4 e''8 |
      fis''8 4 e''4. |
      b''4 g''8 a''4. |
      a''4 fis''8 g''16( fis'') e'' c''( b') g' |
      a'16 b' c'' e'' a'' g'' fis'' dis'' e'' c''( b') g' |
      fis'16 a' c'' e''~ e'' dis''16 e''4. |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      c'4. a |
      b4. e16( g) b e' g' b' |
      e4. s4.
      b4. e |
      a4. c'4. |
      a4 b8 e16 e e e e e |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      \tweak Y-offset #-0.25 r16 ais' b' c'' fis'' e'' \tweak Y-offset #0 r ais' b' c'' e'' c'' |
      \tweak Y-offset #0 r16 a' fis'' a' b' a' s4. |
      \tweak Y-offset #0 r16 ais' b' c'' b' ais' fis' c'' e'' a'' e'' c'' |
      \tweak Y-offset #0 r16 fis' a' dis'' fis'' dis'' s4. |
      s2. |
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne 
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      <b'' g'''>8. 16 16 16 <ais'' fis'''>8. 16 16 16 |
      dis'''16( c''') b'' a'' g'' fis'' e''( dis'') e'' fis'' g'' a'' |
      <g'' b''>8. 16 16 16 <fis'' ais''>8. 16 16 16 |
      a''16( e'') c'' a' b'( c'') b'8 fis'' \glissando b'' |
      <b'' g'''>8. 16 16 16 <ais'' fis'''>8. 16 16 16 |
      b16 b' dis' b' a' b' c'' b' b' b' a' b' |
    }
    \new Voice{ \voiceTwo 
      s2. |
      s2. |
      s2. |
      s4. s8 fis''16 b' b''8 |
      s2. |
      s2. |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e4. e |
      b8 4 4. |
      e4. e |
      a4. b |
      e4. e |
      b8 dis' a' c'' b' a' |
    }
  >>
}

\score {
  <<
    \new Staff \with {
      \consists "Span_arpeggio_engraver"
    } {
            
      \notes
    }
  >>
}
