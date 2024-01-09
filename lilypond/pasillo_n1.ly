\version "2.24.1"
\header {
  title = "Pasillo No. 1"
  composer = "Prof. Francisco A. Velasquez"
  tagline = "Transcribed by John Asmuth"
}

\include "bbarred.ly"

#(define RH rightHandFinger)

<<
  {
    \time 3/4
    \key g \major
    r8 
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        <b'-0> <cis''-2>[ <dis''-4>] <e''-0>[ <fis''-1>] |
        s4 c'''4 s8 b''8 |
        g8[ g'] e''4 r8 fis'' | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \once \override NoteColumn.force-hshift = #1 <b'-3> <ais'-3>[ <a'-1>] <g'-0>[ <fis'-3>] |
        s4 c'''8[ b'] g'[ b''] |
        s4 e''8[ b'] g'[ fis''] |
      }
      \new Voice { \voiceThree
        s8 s2 |
        |
        |
      }
      \new Voice { \voiceFour
        s2 s8 |
        e4~ e2 |
        g4~ g2 |
      }

    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        fis8[ <a'-3>] e''4 r8 e''|
        \fbarre #"2 "{ b8[ <a' dis''>] (e'')[ fis''] g''[ (fis'')] }|
        a8[ <e'-3>] c''4 s8 b'8 | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        s4 e''8[ <c''-1>] a'[ e''] |
        s2. |
        s4  c''8[ g'~] <g' e'>[ b'] |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        fis4~-2 fis2 |
        b4 b2 |
        a4~ a2|
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        fis8[ d'] <c''-1>4 s8 d'' |
        g8[ d'] c''4 s8 b' |
        fis8[ e'] <a' b'>[ e'] fis[ <dis' a' b'>] | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        s4 c''8[ <a'-3>] d'[ <d''-4>]|
        s4 c''8[ <a'-2>] d'[ b']|
        |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        \set fingeringOrientations = #'(left)
        <fis-2>4 fis2 |
        <g-3>4 g2 |
        fis4~ fis f |
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        s4 c''' s8 b'' |
        gis8 <e'-1> <e''-0>4 r8 <b'-4 d''-2> |
        a8[ gis'] b'[ f''] e''4 | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        s4 c'''8[ b'] g'[ b''] |
        s4 e''8[ <b'-0>] e'[ b'] |
        s2 <a' c'' e''>8[ <b' d''>] |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        \set fingeringOrientations = #'(left)
        e4~ e2 |
        <gis-3>4~ gis2|
        a4 a2 |
      }
    >>
    <<
      \new Voice { \voiceOne
        <e'' c''>8[ <fis' b' d''>] <e' c''>[ <d' b'>] <c' a'>[ <b g'>] |
        s4 <e'' g''\3 c'''\2> r8 <e'' g'' c'''> |
        s4 <d'' e'' fis''\3 c'''\2> r8  <e'' fis'' c'''>8 | \break
      }
      \new Voice { \voiceTwo
        s2. |
        a'8\5[ a'] e''[ a'] a'[ e''] |
        d''8\4[ d''] d''[ d''] d''[  \once \override NoteColumn.force-hshift = #1.25 fis''] |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        s4 b''\2 r8 b'' |
        s4 b''\2 r8 b'' |
        s4 a''\2 r8 a'' | \break
      }
      \new Voice { \voiceTwo
        g'8\5[ g'] <d'' e'' b''>[ g'] g'[ <d'' e'' b''>] |
        c''8\4[ c''] <e'' g''\3 b''>[ c''] c''[ <e'' g'' b''>] |
        fis'8\5[ fis'] <e'' fis''\3 a''>[ fis'] fis'[ <e'' fis'' a''>] |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        s4 a''\2 r8 a'' \bar ".|:"
        s4 g''\2 r8 g''\2 \bar ":|."
        s4 g''\2 r8 g'' \bar ".|:" \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        b'8[ b'] <dis''\3 e'' a''>[ b'] b'[ <b' dis'' e'' a''>] |
        <c'\6-3>8[ c'] <d''\3 e'' g''>[ c'] c'[ <c''\3 e'' g''>] |
        c'8\6[ c'] <d''\3 e'' g''>[ c'] b[ <d'' e'' g''>] |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        s4  <g''-4\2>4 r8  <c'' e'' fis''-4> |
        s4 <b' cis'' fis''> r8 <cis'' e''> |
        s4 <bes' c'' fis''> r8 <c'' e''> | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        a8[ <a'-3\4>] <c''\3 e'' g''>[ a] a'[ <a' c''>] \bar ":|."
        e8[ g'\4] \bbarre #"2" { \once \override NoteColumn.force-hshift = #1.25 cis''[ g'] b'[ } cis''] |
        e8[ g'\4] \bbarre #"2" { \once \override NoteColumn.force-hshift = #1.25 cis''[ g'] bes'[ } cis''] |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        s4 <c'' e''> <c'' e''> |
        \fbarre #"2" { <a' c''>8[ e''] dis''[ e''] <a' cis''>[ dis''] }   |
        e''4 \coda s2 | \break
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        a8[ e'] <b'-4\3 c''>[ a'] <g' c''>[ fis'] |
        s2. |
        e8[ b] fis'[ g'] b'[ e''] |
      }
      \new Voice { \voiceThree
        s2. |
        s2. |
        \once \override NoteColumn.force-hshift = #0 e8[ g'] b'[ e''] fis''[ g''] |
      }
      \new Voice { \voiceFour
        s2. |
        fis2 b4 |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        b''2. \bar ".|:"
      }
      \new Voice { \voiceTwo
        g''2. |
      }
      \new Voice { \voiceThree
        |
      }
      \new Voice { \voiceFour
        |
      }
    >>
    \key e \major
    r8
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        b'8 cis''[ dis''] e''[ fis''] |
        cis'''4 b''8 s4. |
        \fbarre #"2" { <a' dis''-3>8[ <a' e''-4>] <gis''-3>[ \slashedGrace gis'' (fis'')] dis''[ } <b'-0>] | \break
      }
      \new Voice { \voiceTwo
        \once \override NoteColumn.force-hshift = #1 b'8 ais'[ a'] gis'[ fis'] |
        s4 \tweak Y-offset #0 r8 <e''\3 gis''\2>8 <e'' gis''>4 |
        s4 \tweak Y-offset #0 r8 \autoBeamOff <a' dis''>8 a' \tweak Y-offset #-3 r8 |
      }
      \new Voice { \voiceThree
        s2 s8 |
        |
        |
      }
      \new Voice { \voiceFour
        s2 s8 |
        e4 e2 |
        b8 b8~ b2 |
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        cis''4 b' s4 |
        r8  \fbarre #"4" { b' <cis''-4>[ <gis' b' dis''>] <b' e''-2>[ <fis''-4>] } |
        \fbarre #"9" { <b' eis''>8[ <b'-2 fis''>] gis''[ <eis'' a''>] <b''-4>[ cis'''] } | \break
      }
      \new Voice { \voiceTwo
        e8[ e8] r8 <e' gis'>8 <e' gis'> 4 |
        gis8[ gis'] \tweak Y-offset #-1.5 r8 <gis'> fis'4 |
        s4 \tweak Y-offset #0 r8 b'8 <b' eis''>4 |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        s2. |
        \once \override NoteColumn.force-hshift = #0 gis4~ gis2 |
        cis'8[ cis'~] cis'2 |
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \fbarre #"9" { <d'''-3>2 cis'''8[ gis''] |
        b''4. a''8 s4 }|
        \tweak Y-offset #0 r8 \bbarre #"2" { fis'' gis''[ a''] cis''[ fis''] } \bar ".|:" \break
      }
      \new Voice { \voiceTwo
        cis'8[ b'] eis''[ gis''] cis'''8[ gis''] |
        fis'8[ cis''] eis''[ a''] (gis'')[ a''] |
        a[ <a' cis''>] \tweak Y-offset #0 r8  <a' cis''> a'4 |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
        |
      }
    >>
    <<
      \new Voice { \voiceOne
        s4 cis'''4. b''8 \bar ":|.|:"
        <e'' gis''>8[ <e'' gis''>] cis'''4 s8 b''  \bar ":|." \break
      }
      \new Voice { \voiceTwo
        b8[ b~] b2 |
        s4 cis'''8[ <e'' gis''>] <e'' gis''>[ b''] |
      }
      \new Voice { \voiceThree
        <a' dis''>8[ <a' dis''>] \tweak Y-offset #0 r8 s4. |
        |
      }
      \new Voice { \voiceFour
        s4. <a' dis'' fis''>8 <a' dis'' fis''>8 s8 |
        e8[ e~] e2 |
      }
    >>
    <<
      \new Voice { \voiceOne
        \bbarre #"5" { <cis'' e''>8[ <cis'' e''>] b''4. a''8 |
        <c'' e''>8[ <c'' e''>] b''4. a''8 } |
        \bbarre #"4" {<b' e''>8[ <b' e''>] a''4. gis''8 } | \break
      }
      \new Voice { \voiceTwo
        s4 \tweak Y-offset #0 r8 <cis'' e''>8 <cis'' e''>4 |
        s4 \tweak Y-offset #0 r8 <c'' e''>8 <c'' e''>4 |
        s4 \tweak Y-offset #0 r8 s8 <b' e''>8[ gis''] |
      }
      \new Voice { \voiceThree
        s2. |
        s2. |
        s4. <b' e''>8 s4 |
      }
      \new Voice { \voiceFour
        a8[ a8~] a2 |
        a8[ a8~] a2 |
        e8[ e8~] e2 |
      }
    >>
    <<
      \new Voice { \voiceOne
        \fbarre #"4" { <b' e''>8[ <b' e''>] a''4 s8 gis'' } |
        \fbarre #"2" { <ais' cis''>8[ <ais' cis''>] gis''4 s8 fis'' |
        <a' dis''>8[ <a' dis''>] gis''4 s8 fis'' } | \break
      }
      \new Voice { \voiceTwo
        s4 a''8[ <b' e''>] <b' e''>[ gis''] |
        s4 gis''8[ <e' ais' cis''>] <e' ais' cis''>[ fis''] |
        s4 gis''8[ <a' dis''>] <a' dis''>[ fis''] |
      }
      \new Voice { \voiceThree
        |
        |
        |
      }
      \new Voice { \voiceFour
        cis'8[ cis'8~] cis'2 |
        fis8[ fis8~] fis2 |
        b8[ b8~] b2 |
      }
    >>
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        r8 gis' b'[ e''] fis''[ <gis''-1>] |
        b''2. \mark \markup  { D.C. hasta \musicglyph #"scripts.coda" } \bar #":|."
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        e8[ <b-2>] <fis'-4>[ gis'] b'[ <e''-2>] |
        gis''2. |
      }
      \new Voice { \voiceThree
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
      }
    >>
    \key g \major
    <<
      \new Voice { \voiceOne
        e''4\coda s2 |
        \set harmonicDots = ##t <g''\harmonic b''\harmonic e'''\harmonic>2. |
        <g' fis'>2. \bar "|."
      }
      \new Voice { \voiceTwo
        e8[ b] fis'[ g'] b'[ e''] |
        s2. |
        <e b>2. |
      }
      \new Voice { \voiceThree
        \tweak Y-offset #-1 r8 g' b'[ e''] fis''[ g''] |
        |
        |
      }
      \new Voice { \voiceFour
        |
        |
        |
      }
    >>
  }
>>
