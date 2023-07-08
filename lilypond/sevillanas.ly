\version "2.24.1"
\header {
  title = "Sevillanas"
  composer = ""
  arranger = ""
  tagline = ""
}

\include "common.ly"

#(define custom-fretboard-table-C (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-C
  \chordmode{c}
  #guitar-tuning
  #'(
      (open 6)
      (place-fret 5 3 3)
      (place-fret 4 2 2)
      (open 3)
      (place-fret 2 1 1)
      (open 1))

#(define custom-fretboard-table-G7 (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-G7
  \chordmode{g:7}
  #guitar-tuning
  #'(
      (place-fret 6 3 3)
      (place-fret 5 2 2)
      (open 4)
      (open 3)
      (open 2)
      (place-fret 1 1 1))

#(define custom-fretboard-table-F (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-F
  \chordmode{f}
  #guitar-tuning
  #'(
      (barre 1 6 1)
      (place-fret 6 1 1)
      (place-fret 5 3 3)
      (place-fret 4 3 4)
      (place-fret 3 2 2)
      (place-fret 2 1 1)
      (place-fret 1 1 1))

#(define custom-fretboard-table-Em (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-Em
  \chordmode{e:m}
  #guitar-tuning
  #'(
      (open 6)
      (place-fret 5 2 2)
      (place-fret 4 2 3)
      (open 3)
      (open 2)
      (open 1))

#(define custom-fretboard-table-B7 (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-B7
  \chordmode{b:7}
  #guitar-tuning
  #'(
      
      (place-fret 6 2 2)
      (open 5)
      (place-fret 4 1 1)
      (place-fret 3 2 3)
      (open 2)
      (open 1))

#(define custom-fretboard-table-Edim (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-Edim
  \chordmode{e:dim}
  #guitar-tuning
  #'(
      
      (mute 6)
      (mute 5)
      (place-fret 4 2 1)
      (place-fret 3 3 3)
      (place-fret 2 2 2)
      (place-fret 1 3 4))

#(define custom-fretboard-table-B7v2 (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-B7v2
  \chordmode{b:7}
  #guitar-tuning
  #'(
      
      (mute 6)
      (place-fret 5 2 2)
      (place-fret 4 1 1)
      (place-fret 3 2 3)
      (open 2)
      (place-fret 1 2 4))

#(define custom-fretboard-table-D (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-D
  \chordmode{d}
  #guitar-tuning
  #'(
      
      (mute 6)
      (mute 5)
      (open 4)
      (place-fret 3 2 1)
      (place-fret 2 3 3)
      (place-fret 1 2 2))

#(define custom-fretboard-table-G (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-G
  \chordmode{g}
  #guitar-tuning
  #'(
      (place-fret 6 3 3)
      (place-fret 5 2 2)
      (open 4)
      (open 3)
      (open 2)
      (place-fret 1 3 4))

#(define custom-fretboard-table-A7 (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-A7
  \chordmode{a:7}
  #guitar-tuning
  #'(
      (open 6)
      (open 5)
      (place-fret 4 2 2)
      (open 3)
      (place-fret 2 2 3)
      (open 1))

#(define custom-fretboard-table-Fsharp (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-Fsharp
  \chordmode{fis}
  #guitar-tuning
  #'(
      (barre 1 6 2)
      (place-fret 6 2 1)
      (place-fret 5 4 3)
      (place-fret 4 4 4)
      (place-fret 3 3 2)
      (place-fret 2 2 1)
      (place-fret 1 2 1))

#(define custom-fretboard-table-D7 (make-fretboard-table))
\storePredefinedDiagram #custom-fretboard-table-D7
  \chordmode{d:7}
  #guitar-tuning
  #'(
      
      (place-fret 6 2 2)
      (open 5)
      (open 4)
      (place-fret 3 2 3)
      (place-fret 2 1 1)
      (open 1))

in_c={
  \key c \major
  \time 3/4
  
  \set strokeFingerOrientations = #'(up)
  
  \repeat volta 2 {
    <e c' e' g' c'' e''\RHd>8^"C" \headsOff <f''\RHu> <f''\RHd> <f''\RHu> \headsOn <e c' e' g' c'' e''\RHd>4 |
    \headsOn <g b d' g' b' f''\RHd>4^"G7" <g b d' g' b' f''\RHd> <e c' e' g' c'' e''\RHd>^"C" |
  }
  <e c' e' g' c'' e''\RHd>8^"C" <e c' e' g' c'' e''\RHu>8 <e c' e' g' c'' e''\RHd>4 r8 a'( |
  g'8) f' e' d' c' e' | g'8 e' f' a' c'' a' | g'8 b' e'' d'' c''4 |
  
  \repeat volta 3 {
    <e c' e' g' c'' e''\RHd>8^"C" <e c' e' g' c'' e''\RHu> <e c' e' g' c'' e''\RHd><e c' e' g' c'' e''\RHu> <e c' e' g' c'' e''\RHd>4 |
    <g b d' g' b' f''\RHd>4^"G7" <g b d' g' b' f''\RHd> <e c' e' g' c'' e''\RHd>^"C" |
    <e c' e' g' c'' e''\RHd>8^"C" <e c' e' g' c'' e''\RHu>8 <e c' e' g' c'' e''\RHd>4 b'8 c'' |
    d''8 c'' b' gis' a'4 |
    
    <f c' f' a' c'' f''\RHd>8^"F" <f c' f' a' c'' f''\RHu>8 <f c' f' a' c'' f''\RHd>4 b'8 c'' |
    d''8 c'' b' a' g'4 |
    <g b d' g' b' f''\RHd>8^"G7" <g b d' g' b' f''\RHu>8 <g b d' g' b' f''\RHd>4 d'8 e' |
    f'8 g' a' b' c''4 |
    
    <e c' e' g' c'' e''\RHd>8^"C" <e c' e' g' c'' e''\RHu>8 <e c' e' g' c'' e''\RHd>4 r8 a'( |
    g'8) f' e' d' c' e' | g'8 e' f' a' c'' a' | g'8 b' e'' d'' c''4 |
  }
   <e c' e' g' c'' e''\RHd>2.^"C" \bar "|."
}

in_em={
  \key e \minor
  \time 3/4
  
  \set strokeFingerOrientations = #'(up)
  
  \repeat volta 2 {
    <e b e' g' b' e''\RHd>8^"Em" <e b e' g' b' e''\RHu>8 <e b e' g' b' e''\RHd>8 <e b e' g' b' e''\RHu>8 <e b e' g' b' e''\RHd>4 |
    <fis a dis' a' b' e''\RHd>4^"B7" <fis a dis' a' b' e''\RHd>4 <e b e' g' b' e''\RHd>^"Em" |
  }
  <e b e' g' b' e''\RHd>8^"Em" <e b e' g' b' e''\RHu>8 <e b e' g' b' e''\RHd>4 r8 b' |
  b'8 b' b' c'' b' c'' | b' c'' b'4 a'8 g' | fis'4 g'8 fis' e'4 |
  
  \repeat volta 3 {
     
    <e b e' g' b' e''\RHd>8^"Em" <e b e' g' b' e''\RHu>8 <e b e' g' b' e''\RHd>8 <e b e' g' b' e''\RHu>8 <e b e' g' b' e''\RHd>4 |
    <fis a dis' a' b' e''\RHd>4^"B7" <fis a dis' a' b' e''\RHd>4 <e b e' g' b' e''\RHd>^"Em" |
    <e b e' g' b' e''\RHd>8^"Em" <e b e' g' b' e''\RHu>8 <e b e' g' b' e''\RHd>4 r8 b' |
    e''4 d''8 c'' b'4 |
    <e b e' g' b' e''\RHd>8^"Em" <e b e' g' b' e''\RHu>8 <e b e' g' b' e''\RHd>4 r8 b' |
    e''8 e'' d'' c'' b'4 |
    <e' bes' cis'' g''\RHd>8^"Edim" <e' bes' cis'' g''\RHu>8 <e' bes' cis'' g''\RHd>8 g'' g'' g'' |
    g''4 fis''8 e'' fis''4 |
    <b dis' a' b' fis''\RHd>8^"B7" <b dis' a' b' fis''\RHu>8 <b dis' a' b' fis''\RHd>4 r8 g' |
    b'8 b' b' c'' b' c'' b' c'' b'4 a'8 g' |
    fis'4 g'8 fis' e'4 |
  }
  <e b e' g' b' e''\RHd>2.^"Em"  \bar "|."
}

in_d={
  \key d \major
  \time 3/4
  
  \set strokeFingerOrientations = #'(up)
  
  \repeat volta 2 {
    <d' a' d'' fis''\RHd>8^"D" <d' a' d'' fis''\RHu>8 <d' a' d'' fis''\RHd>8 <d' a' d'' fis''\RHu>8 <d' a' d'' fis''\RHd>4 |
    <g b d' g' b' g''\RHd>4^"G" <e a e' g' cis'' e''\RHd>4^"A7" <d' a' d'' fis''\RHd>4^"D"
  }
  <d' a' d'' fis''\RHd>8 <d' a' d'' fis''\RHu>8 <d' a' d'' fis''\RHd>4 a8 b |
  cis'8 d' e' fis' d'4 | b'8\3 a' \tuplet 3/2 {g'8( a' g')} fis'8 e' |
  \tuplet 3/2 {d'8( e' d')} cis'8 e' d'4 |
  
  \repeat volta 3 {
    <d' a' d'' fis''\RHd>8^"D" <d' a' d'' fis''\RHu>8 <d' a' d'' fis''\RHd>8 <d' a' d'' fis''\RHu>8 <d' a' d'' fis''\RHd>4 |
    <g b d' g' b' g''\RHd>4^"G" <e a e' g' cis'' e''\RHd>4^"A7" <d' a' d'' fis''\RHd>4^"D"
    <d' a' d'' fis''\RHd>8 <d' a' d'' fis''\RHu>8 <d' a' d'' fis''\RHd>4 a8 b |
    cis'8 d' e' eis' fis'4 |
    <fis cis' fis' ais' cis'' fis''\RHd>8^"F#" <fis cis' fis' ais' cis'' fis''\RHu>8 <fis cis' fis' ais' cis'' fis''\RHd>4 a8 b |
    cis'8 d' e' fis' g'4 |
    <g b d' g' b' g''\RHd>8^"G" <g b d' g' b' g''\RHu> <g b d' g' b' g''\RHd>4 r8 fis' |
    e'( d') cis' b a4 |
    <e a e' g' cis'' e''\RHd>8^"A7" <e a e' g' cis'' e''\RHu> <e a e' g' cis'' e''\RHd>4 a8 b |
    cis'8 d' e' fis' d'4 |
    b'8\3 a' \tuplet 3/2 {g'8( a' g')} fis' e' |
    \tuplet 3/2 {d'8( e' d')} cis'8 e' d'4 |
  }
  \break
  <d' a' d'' fis''\RHd>2.^"D" \bar "|."
}

in_g={
  \key g \major
  \time 3/4
  
  \set strokeFingerOrientations = #'(up)
  
  \repeat volta 2 {
    <g b d' g' b' g''\RHd>8^"G" <g b d' g' b' g''\RHu>8 <g b d' g' b' g''\RHd> <g b d' g' b' g''\RHu>8 <g b d' g' b' g''\RHd>4
    <fis a d' a' c'' e''\RHd>4^"D7" <fis a d' a' c'' e''\RHd>4^"D7" <g b d' g' b' g''\RHd>4^"G" |
  }
  <g b d' g' b' g''\RHd>8^"G" <g b d' g' b' g''\RHu>8 <g b d' g' b' g''\RHd>4 r8 g''( |
  e''8) d''( b') a' g'( a') |
  g'8 e' d'( e') d' c' |
  \tuplet 3/2 {b8( c') d'} \tuplet 3/2 {c'8( b a)} g4 |
  
  \repeat volta 3 {
    <g b d' g' b' g''\RHd>8^"G" <g b d' g' b' g''\RHu>8 <g b d' g' b' g''\RHd> <g b d' g' b' g''\RHu>8 <g b d' g' b' g''\RHd>4
    <fis a d' a' c'' e''\RHd>4^"D7" <fis a d' a' c'' e''\RHd>4^"D7" <g b d' g' b' g''\RHd>4^"G" |
    <g b d' g' b' g''\RHd>8^"G" <g b d' g' b' g''\RHu>8 <g b d' g' b' g''\RHd>4 r8 g''( |
    e''8) d''( b') a' g'( a') |
    g'8 e' d'( e') d' c' |
    \tuplet 3/2 {b8( c') d'} \tuplet 3/2 {c'8( b a)} g8 fis |
    g8 a b a b c' |
    d'8 e' fis' e' d'4 |
    <fis a d' a' c'' e''\RHd>8^"D7" <fis a d' a' c'' e''\RHu>8 <fis a d' a' c'' e''\RHd>4 r8 g''( |
    e''8) d''( b') a' g'( a') |
    g'8 e' d'( e') d' c' |
    \tuplet 3/2 {b8( c') d'} \tuplet 3/2 {c'8( b a)} g4 |
  }
  \break
  <g b d' g' b' g''\RHd>2.^"G" \bar "|."
}

in_a={
  \key a \major
  \time 3/4
  \set strokeFingerOrientations = #'(up)
  
  \repeat volta 2 {
    <e a e' a' cis'' e''\RHd>8^"A" <e a e' a' cis'' e''\RHu>8 <e a e' a' cis'' e''\RHd> <e a e' a' cis'' e''\RHu>8 <e a e' a' cis'' e''\RHd>4
    <e b d' gis' b' e''\RHd>4^"E7" <e b d' gis' b' e''\RHd>4 <e a e' a' cis'' e''\RHd>4^"A" |
  }
  <e a e' a' cis'' e''\RHd>8^"A" <e a e' a' cis'' e''\RHu>8 <e a e' a' cis'' e''\RHd>4 r8 e''8 |
  a''8 gis'' fis'' e'' fis'' e'' | d'' b' \tuplet 3/2 {cis''8 d'' e''\2} \tuplet 3/2 {cis''8 d'' e''\2} |
  d''16 cis'' b' cis'' \tuplet 3/2 {d''8 cis'' b'} a'4 |

  \repeat volta 3 {
    <e a e' a' cis'' e''\RHd>8^"A" <e a e' a' cis'' e''\RHu>8 <e a e' a' cis'' e''\RHd> <e a e' a' cis'' e''\RHu>8 <e a e' a' cis'' e''\RHd>4
    <e b d' gis' b' e''\RHd>4^"E7" <e b d' gis' b' e''\RHd>4 <e a e' a' cis'' e''\RHd>4^"A" |
    <e a e' a' cis'' e''\RHd>8^"A" <e a e' a' cis'' e''\RHu>8 <e a e' a' cis'' e''\RHd>4 r8 e''8 |
    
    a''8 gis'' fis'' e'' d'' cis'' |
    b' a' \tuplet 3/2 {gis' a' b'\3} \tuplet 3/2 {gis' a' b'\3} |
    a'16 b'\3 a' gis' \tuplet 3/2 {a'8 gis' fis'} e'4 |
    <e b d' gis' b' e''\RHd>8^"E7" <e b d' gis' b' e''\RHu>8 <e b d' gis' b' e''\RHd>4 \tuplet 3/2 {gis'8( a') b'} |
    \tuplet 3/2 {cis''8( d'') e''} <d' a' d'' fis''\RHd>8^"D" <d' a' d'' fis''\RHu>8 <d' a' d'' fis''\RHd>4 |
    \tuplet 3/2 {e'8 fis' gis'} \tuplet 3/2 {a' b' d''} <e a e' a' cis'' e''\RHd>4^"A" |
    \tuplet 3/2 {a8 b cis'} \tuplet 3/2 {d'8 e' d'} \tuplet 3/2 {cis'8 b a}
    <e b d' gis' b' e''\RHd>8^"E7" <e b d' gis' b' e''\RHu>8 <e b d' gis' b' e''\RHd>4 r4^\golpe |
    \tuplet 3/2 {e8 fis gis} \tuplet 3/2 {a8 b cis'} \tuplet 3/2 {b8 a gis} |
  }
  \break
  <e a e' a' cis'' e''\RHd>2.^"A" \bar "|."
}

\score {
  <<
    \new ChordNames {
      \override ChordName.font-size = #8
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-C
        c
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-G7
        \set majorSevenSymbol = \markup { "7" }
        g:maj7
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-F
        f
      }
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-C
        c
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-G7
        g:7
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-F
        f
      }
    }
  >>
}
\score {
  \header {
    piece = "Sevillanas in C"
  }
  \new StaffGroup <<
    <<
      \context Staff \with {
        \consists "Span_arpeggio_engraver"
        connectArpeggios = ##t
      } {    
        \in_c
      }
      \context TabStaff {
        \set Staff.stringTunings = \stringTuning <e a d' g' b' e''>
        
        \in_c
      }
    >>
  >>
}

\pageBreak


\score {
  <<
    \new ChordNames {
      \override ChordName.font-size = #8
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-Em
        e:m
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-B7
        \set majorSevenSymbol = \markup { "7" }
        b:7
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-Edim
        e:dim
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-B7v2
        b:7
      }
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-Em
        e:m
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-B7
        \set majorSevenSymbol = \markup { "7" }
        b:7
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-Edim
        e:dim
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-B7v2
        b:7
      }
    }
  >>
}
\score {
  \header {
    piece = "Sevillanas in E minor"
  }
  \new StaffGroup <<
    <<
      \context Staff \with {
        \consists "Span_arpeggio_engraver"
        connectArpeggios = ##t
      } {    
        \in_em
      }
      \context TabStaff {
        \set Staff.stringTunings = \stringTuning <e a d' g' b' e''>
        \in_em
      }
    >>
  >>
}

\pageBreak

\score {
  <<
    \new ChordNames {
      \override ChordName.font-size = #8
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-D
        d
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-G
        g
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-A7
        \set majorSevenSymbol = \markup { "7" }
        a:7
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-Fsharp
        fis
      }
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-D
        d
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-G
        g
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-A7
        \set majorSevenSymbol = \markup { "7" }
        a:7
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-Fsharp
        fis
      }
    }
  >>
}
\score {
  \header {
    piece = "Sevillanas in D"
  }
  \new StaffGroup <<
    <<
      \context Staff \with {
        \consists "Span_arpeggio_engraver"
        connectArpeggios = ##t
      } {    
        \in_d
      }
      \context TabStaff {
        \set Staff.stringTunings = \stringTuning <e a d' g' b' e''>
        \in_d
      }
    >>
  >>
}

\pageBreak

\score {
  <<
    \new ChordNames {
      \override ChordName.font-size = #8
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-G
        g
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-D7
        d:7
      }
    }
    \new FretBoards {
      \override FretBoard.size = 4
      \override FretBoard.fret-diagram-details.finger-code = #'in-dot
      \override FretBoard.fret-diagram-details.dot-color = #'white
      \override FretBoard.fret-diagram-details.barre-type = #'straight
      \override FretBoard.fret-diagram-details.number-type = #'roman-upper
      \override FretBoard.fret-diagram-details.top-fret-thickness = 7
      \override FretBoard.fret-diagram-details.fret-count = 5
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-G
        g
      }
      \chordmode {
        \set predefinedDiagramTable = #custom-fretboard-table-D7
        d:7
      }
    }
  >>
}
\score {
  \header {
    piece = "Sevillanas in G"
  }
  \new StaffGroup <<
    <<
      \context Staff \with {
        \consists "Span_arpeggio_engraver"
        connectArpeggios = ##t
      } {    
        \in_g
      }
      \context TabStaff {
        \set Staff.stringTunings = \stringTuning <e a d' g' b' e''>
        \in_g
      }
    >>
  >>
}

\pageBreak

\score {
  \header {
    piece = "Sevillanas in A"
  }
  \new StaffGroup <<
    <<
      \context Staff \with {
        \consists "Span_arpeggio_engraver"
        connectArpeggios = ##t
      } {    
        \in_a
      }
      \context TabStaff {
        \set Staff.stringTunings = \stringTuning <e a d' g' b' e''>
        \in_a
      }
    >>
  >>
}