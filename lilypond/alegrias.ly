\version "2.24.1"

\include "common.ly"

strumfollow={
    \voiceOne
  \improvisationOn
  \hide TabNoteHead
  \override Beam.positions = #'(4 . 4)
  \tuplet 3/2 { <b' \RHd \RHc>16  <b' \RHd\RHa>16 <b' \RHd\RHm>16 }
  <b'\RHd \RHi>8
  <b'\RHu \RHi>8
  <b'\RHd \RHi>4
  \improvisationOff
  \override TabNoteHead.transparent = ##f
}


ras_five =
#(define-music-function
     (chord)
     (ly:music?)
  #{
    \override Beam.positions = #'(4 . 4)
    \override StrokeFinger.digit-names = ##("p" "i" "m" "a" "c")
    \voiceOne
    \tuplet 5/4 {
    
    #chord
    
    \improvisationOn
    \hide TabNoteHead
    
    <b'\RHd \RHa>16
    <b'\RHd \RHm>16
    <b'\RHd \RHi>16
    <b'\RHu \RHi>16
    
    }
    \improvisationOff
    \override TabNoteHead.transparent = ##f
  #})

followuptwo={
  \voiceOne
  \improvisationOn
  \hide TabNoteHead
  \override Beam.positions = #'(4 . 4)
  
  <b'\RHd \RHi>8
  <b'\RHu \RHi>8
  
  \override TabNoteHead.transparent = ##f
  \improvisationOff
}

followupthree={
  \voiceOne
  \improvisationOn
  \hide TabNoteHead
  \override Beam.positions = #'(4 . 4)
  
  <b'\RHu \RHi>8
  <b'\RHd \RHi>8
  <b'\RHu \RHi>8
  
  \override TabNoteHead.transparent = ##f
  \improvisationOff
}


notes={
  \time 3/4
  \override Beam.positions = #'(4 . 4)
  \override StrokeFinger.digit-names = ##("p" "i" "m" "a" "c")
  \ras_five <e b e' gis' b' e''\RHd\RHc>16
  \ras_five <e b e' gis' b' e''\RHd\RHc>16
  <e b e' gis' b' e''->\RHd\RHi>4
  |
  \noBreak
  r8
  <e b e' gis' b' e''\RHu\RHi>8 \followuptwo
  <e b e' gis' b' e''->\RHd\RHi>4
  |
  \noBreak
  \ras_five <e b e' gis' b' e''\RHd\RHc>16
  <e b e' gis' b' e''->\RHd\RHi>4
  \ras_five <e b e' gis' b' e''\RHd\RHc>16
  |
  \noBreak
  
  <fis a dis' a' b' e''->\RHd\RHi>8 \followupthree
  <fis a dis' a' b' e''->\RHd\RHi>4
  \break
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