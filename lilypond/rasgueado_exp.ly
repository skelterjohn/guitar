\version "2.24.1"
\paper {
  ragged-last = ##t
}

strokeUp = \markup\combine\override #'(thickness . 1.3) \draw-line #'(0 . 2)\raise #2 \arrow-head #Y #UP ##f
strokeDown = \markup\combine\arrow-head #Y #DOWN ##f \override #'(thickness . 1.3) \draw-line #'(0 . 2)
RHu = \tweak staff-padding 5 \rightHandFinger \strokeUp
RHd = \tweak staff-padding 5 \rightHandFinger \strokeDown
RHp = \rightHandFinger #1
RHi = \rightHandFinger #2
RHm = \rightHandFinger #3
RHa = \rightHandFinger #4
RHn = \rightHandFinger #5


strumfollow={
    \voiceOne
  \improvisationOn
  \hide TabNoteHead
  \override Beam.positions = #'(4 . 4)
  \tuplet 3/2 { <b' \RHd \RHn>16  <b' \RHd\RHa>16 <b' \RHd\RHm>16 }
  <b'\RHd \RHi>8
  <b'\RHu \RHi>8
  <b'\RHd \RHi>4
  \improvisationOff
  \override TabNoteHead.transparent = ##f
}

ras_strum =
#(define-music-function
     (chord)
     (ly:music?)
  #{
    \override Beam.positions = #'(4 . 4)
    \override StrokeFinger.digit-names = ##("p" "i" "m" "a" "c")
    \voiceOne
    #chord
    %\hide NoteHead
    \improvisationOn
    \hide TabNoteHead
    \tuplet 3/2 { <b' \RHd \RHn>16  <b' \RHd\RHa>16 <b' \RHd\RHm>16 }
    <b'\RHd \RHi>8
    <b'\RHu \RHi>8
    <b'\RHd \RHi>4
    \improvisationOff
    \override TabNoteHead.transparent = ##f
  #})

notes={
  \time 3/4
  \override Beam.positions = #'(4 . 4)
    \override StrokeFinger.digit-names = ##("p" "i" "m" "a" "c")
  <e b e' gis' b' e''\RHd\RHm\RHa>8 \strumfollow
  |
}


\new StaffGroup <<
  <<
    \context Staff \with {
      \consists "Span_arpeggio_engraver"
      connectArpeggios = ##t
    } {    
      \set strokeFingerOrientations = #'(up)
      \notes
    }
    \context TabStaff {
      \set Staff.stringTunings = \stringTuning <e a d' g' b' e''>
      \notes
    }
  >>
>>