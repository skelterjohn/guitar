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
    \clef bass
    \repeat volta 2 {
      \repeat volta 2 {
        r4^"with great rubato" dis4._\<_\pp \tuplet 2/3 {dis8 dis8} |
        dis4 dis4. \tuplet 2/3 {dis8 dis8} |
        dis4 dis4. \tuplet 2/3 {dis8 dis8_\!} |
        dis4_\mp e e b, |
        cis1_\> s1*0_\! |
        r2. a,8 b, |
        cis4 cis4. \tuplet 2/3 {cis8 d} |
        cis4 b,4 a,4 gis,4 |
        a,2. gis,4 |
        fis,1_\> s1*0_\! |
        r4 e,_\< a, cis_\! |
        d4 cis4. \tuplet 2/3 {b,8 a,} |
        a,1~ | a,1~_\> | a,1_\! |
      }
      
      \tuplet 3/4 {a,4_\p_\< cis e_\!} |
      g2._\sfp_\<~ g4_\! |
      fis4_\> e2 d4_\! |
      cis8 d e2. | 
      \tuplet 3/4 {a,4_\< cis e} |
      \tuplet 3/4 {g8 a b} a2_\!_\mf~ | a2 fis2_\> s1*0_\! |
      e1_\p |
      r2 a,4 e |
      d8 cis b,2 a,4 |
      \alternative {
        \volta 1 {
          a,1 |
        }
        \volta 2 {
          b,1 |
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
          
          r1 |
          
          \repeat unfold 2 {
            \tuplet 3/4 {g'8 fis' e'} \tuplet 3/4 {g'8 fis' e'} |
            \tuplet 3/4 {fis'8 e' d'} \tuplet 3/4 {e'8 d' b} |
            \tuplet 3/4 {cis'4 d' e'~} |
            e'1 |
          }
          
          r1
          
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
          
          r1 |
          
          <b, d>1~ |
          <b, d>1 |
          <a, cis>1~ |
          <a, cis>1 |
          <b, d>1~ |
          <b, d>1 |
          <a, cis>1~ |
          <a, cis>1 |
          <b, d>1~ |
          
          \alternative {
            \volta 1 {
              <b, d>1 |
            }
            \volta 2 {
              r1 |
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
    
      \alternative {
        \volta 1 {
          \loose_g
        }
        \volta 2 {
          <fis b e' a' cis'' fis''>1 |
        }
      }
    }
  }
>>