\version "2.20.0"
\header {
  title = "Quickly Eroding Icy Shoreline"
  composer = "Gulli Björnsson"
  arranger = "Arr. John Asmuth"
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
  % \partial 4
  \key e \minor
  \tempo 4. = 120
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      \numericTimeSignature
      \override BreathingSign.text = \markup { \musicglyph "scripts.virgula" }
      
      \time 6/8
      g8 e' b' g e' b' g e' b' g e' b' 
      \time 4/4
      g8 e' b' e'' g e' b' e'' g e' b' e'' g e' b' e''
      
      \break
      
      \time 6/8
      b8 d' b' b d' b' b d' b' b d' b'
      \time 4/4
      b8 d' g' fis'' b d' g' fis'' b d' g' fis'' b d' g' fis''
      
      \break
      
      \time 6/8
      e'8 g' b' e' g' b' e' g' b' e' g' b'
      \time 4/4
      e'8 g' b' g'' e' g' b' g'' e' g' b' g'' e' g' b' e''
      
      \break
      
      \time 4/4
      fis'8 g' (a') b' fis' g' (a') b' fis' g' (a') b' fis' g' (a') b'
      \time 6/4
      fis'8 g' (a') b' e'' b' fis' g' (a') b' e'' b' fis' g' (a') b' e'' b' fis' g' (a') b' e'' b'
            
      \break
      
      \time 6/8
      c'8 e' g' c' e' g' c' e' g' c' e' g'
      \time 4/4
      c'8 e' g' e'' c' e' a' e'' c' e' b' e'' c' e' c'' e''
            
      \break
      
      \time 6/8
      b8 fis' c'' b fis' c'' b fis' c'' b fis' c''
      \time 4/4
      b8 fis' e'' fis'' b fis' e'' fis'' b fis' e'' fis'' b fis' e'' c''
            
      \break
      
      \time 6/8
      a8 e' c'' a e' c'' a e' c'' a e' c'' 
      \time 4/4
      a8 e' d'' e'' a e' d'' e'' a e' d'' e'' a e' d'' e''
      \time 6/8
      g8 b c'' c' e' b' d' fis' a' fis' (g' fis')
            
      \break
      
      \time 6/8
      c'8 e' g' c' e' g' c' e' g' c' e' g'
      \time 4/4
      c'8 e' g' e'' c' e' a' e'' c' e' b' e'' c' e' c'' e''
            
      \break
      
      \time 6/8
      b8 a' c'' b a' c'' b a' c'' b a' c''
      \time 4/4
      b8 fis' g' c'' b fis' g' c'' b fis' g' c'' b fis' g' c''
            
      \break
      
      \time 6/8
      a8 a' b' a a' b' a a' b' a a' b'
      \time 4/4
      a8 e' a' b' a fis' a' b' a fis' g' b' a fis' a' b'
      \time 6/8
      a'8 b' (c'') g' a' b' fis' g' (a') fis' (g' fis')
      
      \break
      
      \time 6/8
      e'8 g' b' e' g' b' e' g' b' e' g' b'
      \time 4/4
      e'8 g' b' e'' e' g' b' e'' e' g' b' e'' e' g' b' e''
      
      \break
      
      \time 6/8
      d'8 g' b' d' g' b' d' g' b' d' g' b'
      \time 4/4
      d'8 g' b' fis'' d' g' b' fis'' d' g' b' fis'' d' g' b' fis''
      
      \break
      
      \time 6/8
      e'8 g' b' e' g' b' e' g' b' e' g' b'
      \time 4/4
      e'8 g' b' g'' e' g' b' g'' e' g' b' g'' e' g' b' g''
      
      \break
      
      \time 4/4
      fis'8 g' (a') b' fis' g' (a') b' fis' g' (a') b' fis' g' (a') b'
      \time 6/4
      fis'8 g' (a') b' e'' b' fis' g' (a') b' e'' b' fis' g' (a') b' e'' b' fis' g' (a') b' e'' b'
      
      \break 
      
      \time 6/8
      c'8 e' g' c' e' g' c' e' g' c' e' g'
      \time 4/4
      c'8 e' g' e'' c' e' a' e'' c' e' b' e'' c' e' c'' e''
            
      \break
      
      \time 6/8
      b8 fis' c'' b fis' c'' b fis' c'' b fis' c''
      \time 4/4
      b8 fis' e'' fis'' b fis' e'' fis'' b fis' e'' fis'' b fis' e'' c''
            
      \break
      
      \time 6/8
      a8 e' c'' a e' c'' a e' c'' a e' c'' 
      \time 4/4
      a8 e' d'' e'' a e' d'' e'' a e' d'' e'' a e' d'' e''
      \time 6/8
      g8 b c'' c' e' b' d' fis' a' fis' (g' fis')
      
      \break
      
      \fbarre "VII" {
      \time 6/8
      e'8 b' g'' e' b' g'' e' b' g'' e' b' g''
      \time 4/4
      e'8 b' g'' b'' e' b' g'' b'' e' b' g'' b'' e' b' g'' b''
      }
      
      \break
      
      \time 6/8
      d''8\4 fis''\3 b''\2 d'' fis'' b'' d'' fis'' b'' d'' fis'' b''
      \time 4/4
      d''8\4 fis''\3 b''\2 e''\1 d'' fis'' b'' e'' d'' fis'' b'' e'' d'' fis'' b'' e'' 
      
      \break
      
      
      \fbarre "XII" {
      \time 6/8
      e''8 g'' b'' e'' g'' b'' e'' g'' b'' e'' g'' b''
      \time 4/4
      e''8 g'' b'' g''' e'' g'' b'' fis''' e'' g'' b'' e''' e'' g'' b'' fis'''
      }
      
      \break
      
      \time 6/8
      d''8\4 fis''\3 b''\2 d'' fis'' b'' d'' fis'' b'' d'' fis'' b''
      \time 4/4
      d''8 fis'' b'' a''' d'' fis'' b'' g''' d'' fis'' b'' fis''' d'' fis'' b'' d'' \harmonic 
      
      \break
      
      \fbarre "VIII" {
      \time 4/4
      c'8 e'' g'' e''' c' e'' g'' e''' c' e'' g'' e''' c' e'' g'' e'''
      }
      \fbarre "VII" {
      \time 4/4
      b8 d'' g'' d''' b d'' g'' d''' b d'' g'' d''' b d'' g'' d'''
      }
      
      \break
      
      \time 4/4
      a8 c''\3 b'\2 c'''\1 a c'' b' c''' a c'' b' c''' a c'' b' c'''
      \time 4/4
      g8 e' b' g'' g e' b' g'' g e' b' g'' g e' b' g''
      
      \break
      
      \time 6/8
      b8 d' g' d' g' b'  b d' g' d' g' b'
      \time 4/4
      b8 d' g' b' d' g' b' fis'' b d' g' b' d' g' b' fis''
      
      \bar "|."
      
      \break
      
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