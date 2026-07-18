
mezzanine_one_a={
  \set Staff.connectArpeggios = ##t
  \time 3/4
  \key d \major
  \tempo 4=72
  <<
    \new Voice { \voiceOne
      \mark \markup { \circle "A" }
      
      R2. |
      R2. |
      R2. |
      R2. |
	  b''4 b'' b'' |
	  \grace { b''16( } e''2.) |
	  a''4\2 gis'' fis'' |
	  <e''-3\3> <fis''-1\2>\glissando \once \override NoteColumn.glissando-skip = ##t <b'\3-3> |
	  cis''2. |
    }
  >>
}


mezzanine_two_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4=72
  \key d \major
  \time 3/4
  <<
    \new Voice { \voiceOne
      \mark \markup { \circle "A" }
      
      R2. |
      R2. |
    }
  >>
}

mezzanine_three_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4=72
  \key d \major
  \time 3/4
  <<
    \new Voice { \voiceOne
      \mark \markup { \circle "A" }
      
      a'8\4 cis''\3 b'\2 e''\1 b' cis'' |
      g'8 cis'' b' e'' b' cis'' |
      a'8 cis'' b' e'' b' cis'' |
      g'8 cis'' b' e'' b' cis'' |

	  \break

      a'8 cis'' b' e'' b' cis'' |
      g'8 cis'' b' e'' b' cis'' |
      a'8 cis'' b' e'' b' cis'' |
      g'8 cis'' b' e'' b' cis'' |

	  \break

      a'8 cis'' b' e'' b' cis'' |
      g'8 cis'' b' e'' b' cis'' |
      e'8 cis'' b' e'' b' cis'' |
      d'8 cis'' b' e'' b' cis'' |
    }
    \new Voice { \voiceTwo
      a'4 s2 |
      g'4 s2 |
      a'4 s2 |
      g'4 s2 |
      a'4 s2 |
      g'4 s2 |
      a'4 s2 |
      g'4 s2 |
      a'4 s2 |
      g'4 s2 |
      e'4 s2 |
      d'4 s2 |
    }
  >>
}

mezzanine_four_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4=72
  \key d \major
  \time 3/4
  <<
    \new Voice { \voiceOne
      \mark \markup { \circle "A" }
      
      R2. |
      R2. |
    }
  >>
}
