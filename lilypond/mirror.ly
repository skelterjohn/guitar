\version "2.20.0"
\header {
  title = "Making a Mirror"
  composer = "John Asmuth"
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

<<
\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
{
  \set Staff.connectArpeggios = ##t
  \key a \minor
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \time 12/8
      <a'>8 c'' e'' a' c'' e'' a' c'' e'' a' c'' e''
      <b'>8 c'' e'' b' c'' e'' g' c'' e'' g' c'' e''
      \time 4/8
      <a'> c'' e'' c''
      \break
      
      \time 12/8
      <a'>8 c'' e'' a' c'' e'' a' c'' e'' a' c'' e''
      <b'>8 c'' e'' b' c'' e'' g' c'' e'' g' c'' e''
      \time 4/8
      <a'> c'' e'' c''
      \break
      
      \time 12/8
      <a'>8 c'' e'' a' c'' e'' a' c'' e'' a' c'' e''
      <b'>8 c'' e'' b' c'' e'' g' c'' e'' g' c'' e''
      \time 4/8
      <a'> c'' e'' c''
      \break
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      a'4 s8 a'4 s8 a'4 s8 a'4 s8
      b'4 s8 b'4 s8 g'4 s8 g'4 s8
      a'4 s4
      \break
      
      a'4 s8 a'4 s8 a'4 s8 a'4 s8
      b'4 s8 b'4 s8 g'4 s8 g'4 s8
      a'4 s4
      \break
      
      a'4 s8 a'4 s8 a'4 s8 a'4 s8
      b'4 s8 b'4 s8 g'4 s8 g'4 s8
      a'4 s4
      \break
      
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
  >>
}
\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
{
  \set Staff.connectArpeggios = ##t
  \key a \minor
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \time 12/8
      <a'>4. a' a' a'
      <b'>4. b' g' g'
      \time 4/8
      <a'>4 a'
      
      \time 12/8
      <a'>4. a' a' a'
      <b'>4. b' g' g'
      \time 4/8
      <a'>2
      
      \time 12/8
      <a'>4. a' a' a'
      <b'>4. b' g' g'
      \time 4/8
      <a'>2
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
  >>
}
>>