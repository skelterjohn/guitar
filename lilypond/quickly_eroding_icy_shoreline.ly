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
      
      
      \time 6/8
      g8 \p \< \autoLineBreaksOff e' b' g e' b' g e' b' g e' b' \!
      \time 4/4
      g8 \mp \> e' b' e''-- g e' b' e''-- g e' b' e''-- g e' b' e''-- \!
      
      \break
      
      \time 6/8
      b8 \p \< d' b' b d' b' b d' b' b d' b' \!
      \time 4/4
      b8 \mf \> d' g' fis''-- b d' g' fis''-- b d' g' fis''-- b d' g' fis''-- \!
      
      \break
      
      \time 6/8
      e'8 \mp \< g' b' e' g' b' e' g' b' e' g' b' \!
      \time 4/4
      e'8 \f \> g' b' g''-- e' g' b' g''-- e' g' b' g''-- e' g' b' g''-- \!
      
      \break
      
      \time 4/4
      fis'8 \p g' (a') b' fis' g' (a') b' fis' g' (a') b' fis' g' (a') b'
      \time 6/4
      fis'8 g' (a') b' e'' b' fis' g' (a') b' e'' b' fis' g' (a') b' e'' b' fis' g' (a') b' e'' b'
            
      \break
      
      \time 6/8
      <c'-3>8\< <e'-1> g' c' e' g' c' e' g' c' e' g'
      \time 4/4
      <c'-3>8 <e'-1> <g'-0> e'' c' e' <a'-2> e'' c' e' <b'-0> e'' c' e' <b'> e''\!
            
      \break
      
      \fbarre "II" {
      \time 6/8
      b8\mf <fis'-2> <c''-3> b fis' c'' b fis' c'' b fis' c''
      \time 4/4
      b8 <fis'-2> <e''-4> <fis''-1> b fis' e'' fis'' b fis' e'' fis'' b fis' e'' <c''-3>
      }
      
      \break
      
      \time 6/8
      a8 e' c'' a e' c'' a e' c'' a e' c'' 
      \time 4/4
      a8 e' d'' e'' a e' d'' e'' a e' d'' e'' a e' d'' e''
      \time 6/8
      <g-3>8 \> <b-2> <c''-1> <c'-2> <e'-1> b' <d'-4>-"rit." <fis'-3> <a'-1> fis' (g' fis') \shortfermata \!
            
      \break
      
      \time 6/8
      <c'>8\p \< <e'> g' c' e' g' c' e' g' c' e' g'
      \time 4/4
      <c'>8 <e'> <g'> e''-- c' e' <g'> e''-- c' e' <g'> e''-- c' e' <g'> e''--\!
            
      \break
      
      \time 6/8
      <b-2>8 <a'-3> <c''-1> b a' c'' b a' c'' b a' c''
      \time 4/4
      b8 fis' g' c'' b fis' g' c'' b fis' g' c'' b fis' g' c''
            
      \break
      
      \time 6/8
      a8 <a'-2> b' a a' b' a a' b' a a' b'
      \time 4/4
      a8 <e'-1> <a'-2> b' a <fis'-4> a' b' a fis' g' b' a fis' a' b'
      \time 6/8
      a'8\> b' (c'') g' (a') b' fis'\4-"rit." g'\3 (a') fis'\4 (g' fis') \shortfermata \!
      
      \break
      
      \time 6/8
      e'8\pp\< g' b' e' g' b' e' g' b' e' g' b'
      \time 4/4
      e'8 g' b' e''-- e' g' b' e''-- e' g' b' e''-- e' g' b' e''--
      
      \break
      
      \time 6/8
      d'8 g' b' d' g' b' d' g' b' d' g' b'
      \time 4/4
      d'8 g' b' fis''-- d' g' b' fis''-- d' g' b' fis''-- d' g' b' fis''--
      
      \break
      
      \time 6/8
      e'8 g' b' e' g' b' e' g' b' e' g' b'
      \time 4/4
      e'8\! \ff g' b' g''-- e' g' b' g''-- e' g' b' g''-- \> e' g' b' g''--\!
      
      \break
      
      \time 4/4
      fis'8 g' (a') b' fis' g' (a') b' fis' g' (a') b' fis' g' (a') b'
      \time 6/4
      fis'8 g' (a') b' e'' b' fis' g' (a') b' e'' b' fis' g' (a') b' e'' b' fis' g' (a') b' e'' b'
      
      \break 
      
      \time 6/8
      c'8 e' g' c' e' g' c' e' g' c' e' g'
      \time 4/4
      c'8\< e' g' e''-- c' e' a' e''-- c' e' b' e''-- c' e' b' e''--\!
            
      \break
      
      \fbarre "II" {
      \time 6/8
      b8\mf fis' c'' b fis' c'' b fis' c'' b fis' c''
      \time 4/4
      b8 fis' e'' fis'' b fis' e'' fis'' b fis' e'' fis'' b fis' e'' c''
      }
      
      \break
      
      \time 6/8
      a8 e' c'' a e' c'' a e' c'' a e' c'' 
      \time 4/4
      a8 e' d'' e'' a e' d'' e'' a e' d'' e'' a e' d'' e''
      \time 6/8
      g8\> b c'' c' e' b' d'-"rit." fis' a' fis' (g' fis') \shortfermata \!
      
      \pageBreak
      
      \fbarre "VII" {
      \time 6/8
      e'8\< b' g'' e' b' g'' e' b' g'' e' b' g''\!
      \time 4/4
      e'8\> b' g'' b''-- e' b' g'' b''-- e' b' g'' b''-- e' b' g'' b''--\!
      }
      
      \break
      
      \time 6/8
      d''8\4\< fis''\3 b''\2 d'' fis'' b'' d'' fis'' b'' d'' fis'' b''\!
      \time 4/4
      d''8\4\> fis''\3 b''\2 e''--\1 d'' fis'' b'' e''-- d'' fis'' b'' e''-- d'' fis'' b'' e''--\!
      
      \break
      
      
      \fbarre "XII" {
      \time 6/8
      e''8\< g'' b'' e'' g'' b'' e'' g'' b'' e'' g'' b''\!
      \time 4/4
      e''8\f g'' b'' g'''-- e'' g'' b'' fis'''-- e'' g'' b'' e'''-- e'' g'' b'' fis'''--
      }
      
      \break
      
      \time 6/8
      d''8\4 fis''\3 b''\2 d'' fis'' b'' d'' fis'' b'' d'' fis'' b''
      \time 4/4
      d''8-"molto rit."\> fis'' b'' a'''-- d'' fis'' b'' g'''-- d'' fis'' b'' fis'''-- d'' fis'' b'' d'' \harmonic \shortfermata \!
      
      \break
      
      \fbarre "VIII" {
      \time 4/4
      c'8-"poco meno"\mp e'' g'' e''' c' e'' g'' e''' c' e'' g'' e''' c' e'' g'' e'''
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
      b8\< d' g' d' g' b'  b d' g' d' g' b'
      \time 6/8
      b8 d' g' d' g' b'  b d' g' d' g' b'\!
      
      \break
      
      \time 9/8
      b8\mf\>-"molto rit." d' g' d' g' b' g' b' fis''-- b d' g' d' g' b' g' b' fis''--
      \time 9/8
      b8 d' g' d' g' b' g' b' fis''-- b d' g' d' g' b' g' b' fis''-- \fermata \mp \!
      
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