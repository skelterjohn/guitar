
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
      dis'4 s8 dis'4. |
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
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
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
  
  \break
  
  <<
    \new Voice{ \voiceOne 
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      g'16 e' g' b'( c'') e'' c'''( b'') a'' g'' fis'' e'' |
      \tuplet 3/2 { b16[ b' b''] } \tuplet 3/2 { b16[ b' b''] } \tuplet 3/2 { dis'16[ b' b''] } e'16 ais' b' g' e8 |
      r8 e''32 a'' c'''( e''') c'''8 d'16 a' fis'8 \glissando d''\harmonic |
      r8 d'''32( c''') b'' a''( g''8) fis''16[ dis'' e'' b' b'''8\harmonic] |
      r8 c''32 e'' a''( b'') c'''8 b''8 \glissando fis''' b'''8\harmonic |
      r16 g' b' e'' fis'' g'' gis''32( a'') b''( c''') d'''16( b'') e'''8\harmonic |
    }
    \new Voice{ \voiceTwo 
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      c'4. a |
      b8 b dis' e'4 e8 |
      a4. d'4 s8 |
      g'4. c' |
      fis'4. b''16 b'~ 4 |
      e4. e |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne 
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      r16 b' c'' e'' a''( e'') c'''( e'') b''( e'') a''( e'') |
      dis''16 e'' fis'' g'' a'' fis'' b''( c''') a''( b'') g'' e'' |
      c''16 a' c'' e'' c'' a' fis' b' fis'' b' dis''' b' |
      <g''\harmonic b''\harmonic e'''\harmonic>2. |
      b'16 g' fis'' e'' g' b' a' c'' <a' b'> e'' <a' fis''> c'' |
      a'16 b'( c'') a' fis'' a' g' b' <g' e''> fis'' <g' e''> b' |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      a4. fis' |
      c'4 b8 e4. |
      fis'4. b4 8 |
      e8 16 16 16 16 e g b e' g' b' |
      e4. a |
      dis'4 b8 e4. |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      s2. |
      s2. |
      s2. |
      s2. |
      s4. \override Beam.positions = #'(-2.5 . -2.5) \tweak Stem.X-offset #1.3 \tweak X-offset #1.3 a'8 8 8 |
      s4. \override Beam.positions = #'(-3.5 . -3.5) \tweak Stem.X-offset #1.3 \tweak X-offset #1.3 g'8 8 8 |
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e'16 g' b' g''( fis'') e'' g'' c'' c''' b'' a'' g'' |
      fis''4 b''8 g'8 b' \glissando e'' |
      \grace{ b''16( c'''} b''16) g'' e'' b' e''' b' r16 d'''32( c''') b''16 c''' a'' e'' |
      b16 fis' b' dis'' fis'' dis'' <g' b' g''>4 s8 |
      r16 fis'32 c'' e''16 c'' a'' e'' fis''( g'') c''' b'' a'' g'' |
      fis''16 a'' c''' e'''~ e''' dis''' e'''8 32( b'') g'' fis'' e''8 |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      c'4. a |
      b4. e |
      e4. a |
      s4. \override Beam.positions = #'(-3 . -6) g'16 fis' e' d' c' b |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      s2. |
      \tweak Y-offset #0 r16 fis' b' dis'' b' a' s16 <b' e''>8 8 16 |
      s2. |
      b4 s8 e4. |
      a4. c |
      a4 b8 e4 <e g' b' e''>8-> |
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      \tuplet 2/3 { <b' e'' g''>8 <ais' b' e'' > } \tuplet 2/3 {<ais' e'' fis''> <ais' b' e''>}
      fis''8. a'' <a'' dis'''>8 b''32( cis''') dis'''( e''') fis'''8 |
      \tuplet 2/3 { <b' e'' g''>8 <ais' e'' fis''> } \tuplet 2/3 {<ais' b' e''> <b' d '' e''>}
      r16 e'' a''( e'') c'''( e'') b''( c''') fis'' b'' b'8 |
      \tuplet 2/3 { <g' b' g''>8 <g' b' e''> } \tuplet 2/3 {<ais' b' fis''>8 <g' b' e''>} |
      <fis' a'>16 dis''( e'') fis'' b dis'' r <a' dis'' fis''(> g'') a'' b fis'' |
    }
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      \hideNotes
      \omit TupletNumber 
      \tuplet 2/3 { g''8 \glissando b' } \tuplet 2/3 {fis''\glissando b'}
      \undo \omit TupletNumber 
      \unHideNotes
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e8 8 8 8 8 8 |
      s4. <b' fis''>4. |
      e8 8 8 8 8 8 |
      a4. b4 <b fis' b'>8 |
      s2. |
      b4 8 4 8 |
      
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      s2. |
      \once\override Slur.control-points =
      #'((1 . 1) (2 . 2) (3 . 1) (4 . 0))
      <dis' a' c''(>16 b') a' 
      \once\override Slur.control-points =
      #'((1 . 1) (2 . 2) (3 . 1) (3.5 . 0))
      <fis' c'' dis''(> b') c'' s4. |
      s2. |
      \once \override Beam.positions = #'(-3 . -1) <e' a' c''>8 c'' e'' dis''4 b8 \glissando |
      e8 8 8 8 8 8 |
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      <g' b' g''>16 fis'' e'' dis'' e'' b' c'' a' c'' e'' a'' c''' |
      <e'' g'' b''>16 g'' e'' <fis'' a'' dis'''> a'' fis'' e'''( b'') b'' b' b' b |
      r16 b'8 8 8 8 8 16 |
      a'16 b' c'' dis'' e'' fis'' g''8 8 8 |
      e''16 ais' b' c'' fis'' e'' g'' ais' b' c'' e'' c'' |
      fis''16 a' fis'' a' b' a' e''4. |
    }
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      s16  \grace {fis''( g''} \hideNotes fis'')\unHideNotes s4 s4. |
      s2. |
      b'8 c'' g' a' <a' c''> <a' dis''> |
      s4. \tweak Y-offset #.5 r16 b' ais' b' c''( b') |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e4. a |
      b8. b' e4. |
      e2. |
      a'4 fis'8 e'4. |
      c'4. a |
      b4. e16( g) b e' g' b' |
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \tweak Y-offset #4 r32 \repeat unfold 3 b''
      \tweak Y-offset #4 r \repeat unfold 3 b''
      \tweak Y-offset #4 r \repeat unfold 3 g''
      \tweak Y-offset #4 r \repeat unfold 3 a''
      \tweak Y-offset #4 r \repeat unfold 3 a''
      \tweak Y-offset #4 r \repeat unfold 3 a'' |
      
      \tweak Y-offset #4 r32 \repeat unfold 3 a''
      \tweak Y-offset #4 r \repeat unfold 3 a''
      \tweak Y-offset #4 r \repeat unfold 3 fis''
      \tweak Y-offset #4 r \repeat unfold 3 g''
      \tweak Y-offset #4 r \repeat unfold 3 g''
      \tweak Y-offset #4 r \repeat unfold 3 g'' |

      a'16 b' c'' e'' a'' g'' fis'' dis'' e'' c''( b') g' |
      fis'16 a' c'' e''~ e'' dis'' <b e' g' b' e''>4. |
      r16 b' c'' e'' a'' b'' c''' b'' a'' g'' fis'' e'' |
      r16 g'' fis'' d'' b' g' b'( c'') e'' g'' b''( c''') |
    }
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e8 ais' b' a b' c'' |
      c'8 e' b e ais'16( b') c''( b') |
      a4. c' |
      a4 b8 e8 16 16 16 16 |
      a4. d' |
      g4. c' |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      r16 c'' e'' a'' b'' c''' b'' a'' g'' fis'' e'' dis'' |
      e''16 b' g'' e'' b'' g'' e'' f''32 gis'' f'''16 e''' d''' b'' |
      c'''16[ a'' e''] a''[ e'' c''] fis''[ c'' a'] e''[ c'' a'] |
      dis''16 fis' a' dis'' fis'' dis'' b''[ g'' e''] g''[ e'' b'] |
      r16 a' b' c''( b') a' dis'' ais''( b') dis'' fis'' dis'' |
      <g' b' g''>8. 16 16 16 <ais' b' fis''>8. 16 16 16 |
    }
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      fis'4. b |
      e4. e |
      a4. a |
      c'4 b8 e4. |
      fis4. b |
      <e b e'>4. <e e'> |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      dis'''16 c'''( b'') a''( g'') fis'' e'' g' e' \glissando fis' g' b' | 
      <g' b' g''>8. 16 16 16 <ais' b' fis''>8. 16 16 16 |
      fis'16 a' c'' e'' b dis''  <g' b' e''>8 16 16 16 16 |
      <g' b' g''>8. 16 16 16 <ais' b' fis''>8. 16 16 16 |
      dis'''16 c'''( b'') a''( g'') fis'' e'' g' e' \glissando fis' g' b' |
      g'8. 16 16 16 <b fis'>8 16 16 16 16 |
    }
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      e2. |
      <e b e'>4. <e e'> |
      a4 b8 <e b e'>4. |
      <e b e'>4. <e e'> |
      e2. |
      <e b e'>4. e |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
  >>
  
  \break
  
  <<
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      r16 a'32( b') c''16 e'' b dis' <e' g' b' e''>4. |
    }
    \new Voice{ \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      a4 b8 <e b>8 b32( a) g( fis) e8 |
    }
    \new Voice{ \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    }
  >>
  
  \bar "|."
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
