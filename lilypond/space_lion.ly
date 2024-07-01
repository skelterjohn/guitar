\version "2.20.0"
\header {
  title = "Space Lion"
  composer = "Yoko Kanno"
  arranger = "Arr. John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

loose_g={
  <g' b' d'' e''>4
  <g' b' d'' e''>8
  <g' b' d'' e''>4
  <g' b' d'' e''>8
  <g' b' d'' e''>4
}

loose_a={
  <a' cis'' e'' e''>4
  <a' cis'' e'' e''>8
  <a' cis'' e'' e''>4
  <a' cis'' e'' e''>8
  <a' cis'' e'' e''>4
}

<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
      instrumentName = #"Trombone"
      shortInstrumentName = #"T."
  }
  {
    \set Staff.connectArpeggios = ##t
    \clef tenor
    \key e \major
    \repeat volta 2 {
      \repeat volta 2 {
        r4^"with great rubato" dis'4._\<_\pp \tuplet 2/3 {8 8} |
        dis'4 4. \tuplet 2/3 {8 8} |
        dis'4 4. \tuplet 2/3 {8 8_\!} |
        dis'4_\mp e' e' b |
        cis'1_\> s1*0_\! |
        r2. a8 b |
        cis'4 4. \tuplet 2/3 {8 d'} |
        cis'4 b4 a4 gis4 |
        a2. gis4 |
        fis1_\> s1*0_\! |
        r4 e_\< a cis'_\! |
        d'4 cis'4. \tuplet 2/3 {b8 a} |
        a1~ | a1~_\> | a1_\! |
      }
      
      \key d \major
      \tuplet 3/4 {a4_\p_\< cis' e'_\!} |
      g'1_\sfp_\< <>_\! |
      fis'4_\> e'2 d'4_\! |
      cis'8 d' e'2. | 
      \tuplet 3/4 {a4_\< cis' e'} |
      \tuplet 3/4 {g'8 a' b'} a'2_\!_\mf~ | a'2 fis'2_\> <>_\! |
      e'1_\p |
      r2 a4 e' |
      \tuplet 3/4 {d'4 cis' b~} |
      b2. a4 |
      \alternative {
        \volta 1 {
          a1 |
        }
        \volta 2 {
          b1 |
        }
      }
    }
  }
  \new PianoStaff \with {
    \consists "Span_arpeggio_engraver"
      instrumentName = #"Piano"
      shortInstrumentName = #"P."
  } {
    <<
      \new Staff {
        \clef treble
        \key e \major
        \repeat volta 2 {
          \repeat volta 2 {
            R1*4 |
            r2 r4 cis'8 e' |
            a'8 b' cis'' e'' a''2 |
            \tuplet 3/4 {gis''4 a'' gis''} |
            \tuplet 3/4 {gis''4 a'' gis''} |
            a''2. gis''4 |
            fis''1 |
            r1 |
            r1 |
            r2 e'8 a' b' cis'' e'' cis'' b' a'~ a'2~ |
            a'1 |
          }
          
          \key d \major
          r1 |
          
          \repeat unfold 2 {
            \tuplet 3/4 {g'8 fis' e'} \tuplet 3/4 {g'8 fis' e'} |
            \tuplet 3/4 {fis'8 e' d'} \tuplet 3/4 {e'8 d' b} |
            \tuplet 3/4 {cis'4 d' e'~} |
            e'1 |
          }
          
          r1 r1|
          
          \alternative {
            \volta 1 {
              r1
            }
            \volta 2 {
              r1
            }
          }
        }
      }
      \new Dynamics {
        \repeat volta 2 {
          \repeat volta 2 {
            R1*4 |
            r1\sustainOn r1
            r1\sustainOff
            R1*5
            r1\sustainOn r1
            r1\sustainOff
          }
          \alternative {
            \volta 1 {
              
            }
            \volta 2 {
              
            }
          }
        }
      }
      \new Staff {
        \clef bass
        \key e \major
        \repeat volta 2 {
          \repeat volta 2 {
            R1*4 |
            a,8_\mp b, cis e a8 b r4 |
            r1 |
            fis1 |
            f1 |
            e1 |
            dis1 |
            r1 |
            r1 |
            a,8 e a b r2 |
            r1 |
            r1|
          }
          
          \key d \major
          r1 |
          
          <b, d>1~ |
          <b, d>1 |
          <a, cis>1~ |
          <a, cis>1 |
          <b, d>1~ |
          <b, d>1 |
          <a, cis>1~ |
          <a, cis>1 |
          <g, b,>1~ |
          <g, b,>1 |
          
          \alternative {
            \volta 1 {
              <e, a,>1 |
            }
            \volta 2 {
              <e, a,>1 |
            }
          }
        }
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
      instrumentName = #"Guitar"
      shortInstrumentName = #"G."
  }
  {
    \set Staff.connectArpeggios = ##t
    \clef treble
    \key e \major
    \repeat volta 2 {
      \repeat volta 2 {
        <fis b fis' b' dis''>1_\mp~ |
        <fis b fis' b' dis''>1 |
        <fis b fis' b' dis''>1~ |
        <fis b fis' b' dis''>1 |
        <e a e' a' cis''>1~ |
        <e a e' a' cis''>1 |
        <cis' f' b' cis''>1 |
        <d' fis' a' cis''>1 |
        <a e' a' cis''>1 |
        <b fis' b' dis''>1 |
        <a e' a' cis''>1 |
        <a fis' a' d'' e''>1 |
        <a e' a' cis'' e''>1~ |
        <a e' a' cis'' e''>1~ |
        <a e' a' cis'' e''>1 |
      }
    
      \key d \major
      r1 |
      \loose_g
      \loose_g
      \loose_a
      \loose_a
      \loose_g
      \loose_g
      \loose_a
      \loose_a
      \loose_g
      \loose_g
     
    
      \alternative {
        \volta 1 {
          r1
        }
        \volta 2 {
          r1 |
        }
      }
    }
  }
>>