\version "2.18.2"
\header {
  title = "Rakuen tableture cheatsheet"
  composer = "Tsuneo Imahori"
  arranger = "Arr. John Asmuth"
  
}

\include "bbarred.ly"
#(define RH rightHandFinger)
#(set-global-staff-size 18)

\markup { "These tabs should help with decyphering this piece's unique tuning." }         
\markup { "Each major section is included, in order of first appearance." }
\markup { "Variations are not included, and are best improvised anyway (as Tsuneo Imahori was likely doing)." } 

\score {
  \header {
  piece = \markup { \line { \circle 1 \circle 2 \circle 3 \circle 4 \circle 5 \circle 6 "= D A G D G D" } }
  }
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
            <d''~ g' >1 | <d'' g' >2 <d'' g' >2 |
            <d''~ g' >1 | <d'' g' >2 <d'' g' >2 | 
            <d''~ g' >1 |  <d'' g'>2 <d'' g' >2 |
            <d''~ g' >1 |  <d'' g'>2 <d'' g' >2 |
            <d'' g' >1 |  <d'' g'>1 |
        }
        \new Voice { \voiceTwo
          <e' g e>1 | <e' g e>2 <g e>2 |
          <d' g f>1 | < d' g f>2 < d' g>2 | 
          < d' g g>1 |  < d' g g>2 < d' g g>2 |
          < d' g f>1 |  < d' g f>2 < d' g f>2 |
            < d' g ees>1 |  < d' g f>1 |
        }
        \new Voice { \voiceThree
          s1 | s2 <e'>4. (<d'>8) |
          s1 | s2 <f>4. \glissando <g>8 |
          s1 | s1 | s1 | s1 | s1 | s1 |
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          <d''~ g'~ >1 | <d'' g' >2 <d'' g' >2 |
          <d''~ g'~ >1 | <d'' g' >2 <d'' g' >2 | 
          <d''~ g'~ >1 |  <d'' g'>2 <d'' g' >2 |
          <d''~ g'~ >1 |  <d'' g'>2 <d'' g' >2 |
          <d'' g'~ >1 |  <d'' g'>1 |
        }
        {
          <e'~ g~ e~>1 | <e' g e>2 <g e>2 |
          <d'~ g~ f~>1 | < d' g f>2 < d' g>2 | 
          < d'~ g~ g~>1 |  < d' g g>2 < d' g g>2 |
          < d'~ g~ f>1 |  < d' g f>2 < d' g f>2 |
            < d' g ees>1 |  < d' g f>1 |
        }
        {
          s1 | s2 <e'>4. (<d'>8) |
          s1 | s2 <f>4. \glissando <g\6>8 |
          s1 | s1 | s1 | s1 | s1 | s1 |
        }
      >>
    }
  >>
}

\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          g8 d' g' a' <b' fis'>8 \tuplet 3/2 { c''16( b' a') } g'8 d' | c'8 d' g' c' d' g' b d' |
          g8 d' g' a' <b' fis'>16 (c'') <d''>8 g'8 d' | c'8 d' g' c' d' g' b d' |
        }
        \new Voice { \voiceTwo
          g4 s fis' s | c'4 s8 c'4 s8 b4 |
          g4 s fis' s | c'4 s8 c'4 s8 b4 |
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          g8 d' g' a' <b' fis'>8 \tuplet 3/2 { c''16 (b' a') } g'8 d' | c'8 d' g' c' d' g' b d' |
          g8 d' g' a' <b' fis'>16 (c'') <d''-0>8 g'8 d' | c'8 d' g' c' d' g' b d' |
        }
        {
        }
        {
        }
      >>
    }
  >>
}

\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          \grace { d( fis } g8) d'\5 d'\4 g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
          g8 d' d' g' g8 d' g' d' | d'8 d' g' d' d' g' d' d' |
        }
        \new Voice { \voiceTwo
          g4 s g s | d'4 s d' s | 
          g4 s g s | d'4 s d' s | 
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          \set fingeringOrientations = #'(left)
          \grace { d (fis } g8\6) d'\5 d'\4 g' g8\6 d'\5 g' d' | d'8\5 d' g' d' d'\5 g' d' d'\5 |
          g8\6 d'\5 d'\4 g' g8\6 d'\5 g' d' | d'8\5 d' g' d' d'\5 g' d' d'\5 |
        }
        {
        }
        {
        }
      >>
    }
  >>
}
\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          \set fingeringOrientations = #'(left)
          g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
          g8 d' <b' g'> g <a' g'>\staccato g' g e'~ | e' g' c'' d'' ees' g' c'' d'' |
        }
        \new Voice { \voiceTwo
          \set fingeringOrientations = #'(left)
        g4 s fis' s | s1 |
        g4 s2 s8 e'4 s8 s4 ees'4 s |
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' b g' |
          g8 d' <b' g'> g <a' g'>\staccato g' g e'~ | e' g' c'' d'' ees' g' c'' d'' |
        }
        {
        }
        {
        }
      >>
    }
  >>
}
\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          \set fingeringOrientations = #'(left)
          g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' d' d16 (fis) |
          g8 d' g' a'16 d'16 <b'\3 g'\4>8 \staccato <a' fis'>4 <g' e'>8~ | <g' e'>4 r8 <g' e'>4. r4 |
        }
        \new Voice { \voiceTwo
          \set fingeringOrientations = #'(left)
          g4 s fis' s | s1 |
          g4 s2 s8 g8 | s2. s8  d16 (fis) |
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          g8 d' g' a' <d'' fis'> a' g' c' | fis' g' a' c' g' a' d' d16 (fis) |
          g8 d' g' a'16 d'16 <b'\3 g'\4>8 \staccato <a'\3 fis'>4 <g' e'>8~ | <g' e'>4 r8 <g' e'>4. r4 |
        }
        {
          s1 | s1 |
          s2. s8 g8 | s2. s8  d16 (fis) |
        }
        {
        }
      >>
    }
  >>
}
\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          \set fingeringOrientations = #'(left)
          g8 d' g' a' <c''\3 a'\2> <d''\2 g'\3>4 d''8\1 | g8 d' g' a' <c'' a'>16 d' <d'' g'>4 d''8 |
          g8 d' g' a' <c'' a'> <d'' g'>4 d''8 | g8-\markup { "rit." } d' g' a' d''2 |
        }
        \new Voice { \voiceTwo
          \set fingeringOrientations = #'(left)
          g4 s2. | g4 s2. | 
          g4 s2. | g4 s2. |
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          g8 d' g' a' <c''\3 a'\2> <d''\2 g'\3>4 d''8\1 | g8 d' g' a' <c''\3 a'\2>16 d' <d''\2 g'\3>4 d''8 |
          g8 d' g' a' <c''\3 a'\2> <d''\2 g'\3>4 d''8 | g8-\markup { "rit." } d' g' a' d''2 |
        }
        {
        }
        {
        }
      >>
    }
  >>
}
\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          \set fingeringOrientations = #'(left)
          <c'-4>8 <fis'-3> g' a' d fis' g' a' | <g-4\6> <b-3\5> d' g' a' g' d' b | 
          c'8 fis' g' a' d fis' g' a' | e b fis' g' d'' g' fis' b | 
        }
        \new Voice { \voiceTwo
          \set fingeringOrientations = #'(left)
          c'4 s d s | g\6 s a' s |
          c' s d s | e s2. |
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          <c'-4>8 <fis'-3> g' a' d fis' g' a' | <g-4\6> <b-3\5> d' g' a' g' d' b | 
          c'8 fis' g' a' d fis' g' a' | e b fis' g' d'' g' fis' b | 
        }
        {
        }
        {
        }
      >>
    }
  >>
}
\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          \set fingeringOrientations = #'(left)
          g8 d' g' <a'-0> \grace <a'-1\3> \glissando b'4  d''4 |  f'8 g' c'' f' g' c'' e' d' |
          g8 d' g' a' \grace a' \glissando b'4 d''4 |  f'8 g' c'' f' g' c'' e' d' |
          g8 d' g' a' \grace a' \glissando b'4 d''8 d''8 | f'8 g' e'' c'' f' b' e' d' |
          g8 d' \grace a'( <d''\1 b'\2>) d' <d''\1 a'\3> g' g e'~ | e' g' c'' d'' ees' g' c'' d'' |
        }
        \new Voice { \voiceTwo
          \set fingeringOrientations = #'(left)
          g4 s4 r8 d'8 <a'-0>8[ (<c''-3>)]  | f'4 s8 f'4 s8 e'4 |
          g4 s4 r8 d'8 <a'-0>8[ (<c''-3>)] | f'4 s8 f'4 s8 e'4 |
          g4 s4 r8 d'4. | s4 e''8 c'' s8 b'4 s8 |
          g4 s2 g4 | s1 |
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          g8 d' g' <a'-0> \grace <a'-1\3> \glissando b'4\3 <a'-0>8 (<c''-3>) |  f'8 g' c'' f' g' c'' e' d' |
          g8 d' g' a' \grace a'\3 \glissando b'4\3 a'8 (c'') |  f'8 g' c'' f' g' c'' e' d' |
          g8 d' g' a' \grace a'\3 \glissando b'4\3 d''8\2 d''8 | f'8 g' e'' c'' f' b' e' d' |
          g8 d' \grace a'( <d''\1 b'\2>) d' <d''\1 a'\3> g' g e'~ | e' g' c'' d'' ees' g' c'' d'' |
        }
        {
          g4 s4 r8 d'8 d''4 | f'4 s8 f'4 s8 e'4 |
          g4 s4 r8 d'8 d''4 | f'4 s8 f'4 s8 e'4 |
          g4 s4 r8 d'4. | s4 e''8 c'' s8 b'4 s8 |
          g4 s2 g4 | s1 |
        }
        {
        }
      >>
    }
  >>
}
\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          \set fingeringOrientations = #'(left)
          g8 d' g' a' d'' g' a' d'' | e' g' d'' c'' es' b' g' es' |
          g8 d' g' a' d'' g' a' d'' | e' g' d'' b' es' g' d'' g' |
          g8 d' g' a' fis' g' a' d'' c' g' a' fis' c' a' fis'4 |
          g8 d' g' a' <b' g'> <a' fis'>4 <g' e'>8~ | <g' e'>4 r8 <g' e'>4. r4 |
        }
        \new Voice { \voiceTwo
          \set fingeringOrientations = #'(left)
          g4 s f' s | e' s ees' s |
          g4 s f' s | e' s ees' s |
          g4 s fis' s | c' s c' s8  d16 (fis) |
          g4 s2. | s2 s4.  d16 (fis) |
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          g8 d' g' a' d'' g' a' d'' | e' g' d'' c'' es' b' g' es' |
          g8 d' g' a' d'' g' a' d'' | e' g' d'' b' es' g' d'' g' |
          g8 d' g' a' fis' g' a' d'' c' g' a' fis' c' a' fis'4 |
          g8 d' g' a' <b'\3 g'\4> <a'\3 fis'\4>4 <g'\3 e'\4>8~ | <g'\3 e'\4>4 r8 <g' e'>4. r4 |
        }
        {
          g4 s f' s | e' s ees' s |
          g4 s f' s | e' s ees' s |
          g4 s fis' s | c' s c' s8  d16 (fis) |
          g4 s2. | s2 s4.  d16 (fis) |
        }
        {
        }
      >>
    }
  >>
}
\score {
  <<
    \new Staff {
      <<
        \new Voice { \voiceOne
          \set fingeringOrientations = #'(left)
          g8 d' g' a' <b' fis'>8 \tuplet 3/2 { c''16( b' a') } g'8 d' | c'8 d' g' c' d' g' b d' |
          g8 d' g' a' <b' fis'>16 (c'') d''8 g'8 a \glissando | c'8 g' fis' g' d'' a' g' fis' |
          <d'' g'>2 <d'' g'>2 | <d'' g' g e'>1 \arpeggio |
        }
        \new Voice { \voiceTwo
          \set fingeringOrientations = #'(left)
          g4 s fis' s | c'4 s8 c'4 s8 b4 |
          g4 s fis' s8 a8 | c'4 s2. |
          <d' g f>2 <d' g ees>2 |
        }
        \new Voice { \voiceThree
        }
      >>
    }
    \new TabStaff {
      \set Staff.stringTunings = \stringTuning <d g d' g' a' d''>
      << 
        {
          g8 d' g' a' <b' fis'>8 \tuplet 3/2 { c''16 (b' a') } g'8 d' | c'8 d' g' c' d' g' b d' |
          g8 d' g' a' <b' fis'>16 (c'') d''8 g'8 a \glissando | c'8 g' fis' g' d'' a' g' fis' |
          <d'' g'>2 <d'' g'>2 | <d'' g' g e'>1 \arpeggio |
        }
        {
          g4 s fis' s | c'4 s8 c'4 s8 b4 |
          g4 s fis' s8 a8 | c'4 s2. |
          <d' g f>2 <d' g ees>2 |
        }
        {
        }
      >>
    }
  >>
}