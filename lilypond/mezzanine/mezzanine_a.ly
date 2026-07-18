
mezzanine_one_a={
	\set Staff.connectArpeggios = ##t
	\guitarSetup
	\time 3/4
	\key d \major
	\tempo 4=130
	<<
		\new Voice { \voiceOne
			\mark \markup { \circle "A" }
			
			R2. |
			R2. |
			R2. |
			R2. |

			\break
			
			R2. |
			R2. |
			R2. |
			R2. |

			\break

			b'4 b' b' |
			\appoggiatura { b'8 } <e'-0>2. |
			\textSpannerUp
			\stringNumberSpanner "2"
			a'4\startTextSpan gis' fis'\stopTextSpan |
			<e'-3\3> <fis'-1\2>\tag #'print \glissando \once \override NoteColumn.glissando-skip = ##t <b\3-3> |

			\break

			<cis'-1>2. |
			R2. |
			R2. |
			R2. |

			\break

			b'4 b' b' |
			\appoggiatura { b'8 } <cis''>2. |
			e''4. d''8 cis'' d'' |
			b'8 cis'' d''4 cis''8 b' |

			\break

			<a'>2. |
			g'2. |
			e'2. |
			d'2. |
		}
	>>
}


mezzanine_two_a={
	\set Staff.connectArpeggios = ##t
	\guitarSetup
	\tempo 4=130
	\key d \major
	\time 3/4
	<<
		\new Voice { \voiceOne
			\mark \markup { \circle "A" }
			
			r4 <cis'-3\3>8 <d'-1\2> cis' d' |
			<g-2\4>2. |
			r4 cis'8 d' cis' d' |
			<a-4>2. |

			\break
			
			r4 <cis'>8 <d'-1> cis' d' |
			<g-2>2. |
			r4 cis'8 d' cis' d' |
			<a-4>2. |

			\break
			
			<a cis' d' e'>4\arpeggio cis'8 d' cis' d' |
			g2. |
			r4 cis'8 d' cis' d' |
			a2. |

			\break
			
			r4 cis'8 d' cis' d' |
			g2. |
			r4 cis'8 d' cis' d' |
			a2. |

			\break
			
			<a cis' d' e'>4\arpeggio cis'8 d' cis' d' |
			g2. |
			r4 cis'8 d' cis' d' |
			a2. |

			\break
			
			r4 cis'8 d' cis' d' |
			g2. |
			r4 cis'8 d' cis' d' |
			a2. |
		}
	>>
}

mezzanine_three_a={
	\set Staff.connectArpeggios = ##t
	\guitarSetup
	\tempo 4=130
	\key d \major
	\time 3/4
	<<
		\new Voice { \voiceOne
			\mark \markup { \circle "A" }
			
			a8\4 cis'\3 b\2 e'\1 b cis' |
			g8 cis' b e' b cis' |
			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |

			\break

			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |
			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |

			\break

			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |
			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |

			\break

			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |
			e8 cis' b e' b cis' |
			d8 cis' b e' b cis' |

			\break

			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |
			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |

			\break

			a8 cis' b e' b cis' |
			g8 cis' b e' b cis' |
			e8 cis' b e' b cis' |
			d8 cis' b e' b cis' |
		}
		\new Voice { \voiceTwo
			a4 s2 |
			g4 s2 |
			a4 s2 |
			g4 s2 |

			\break
			a4 s2 |
			g4 s2 |
			a4 s2 |
			g4 s2 |

			\break

			a4 s2 |
			g4 s2 |
			a4 s2 |
			g4 s2 |

			\break

			a4 s2 |
			g4 s2 |
			e4 s2 |
			d4 s2 |

			\break

			a4 s2 |
			g4 s2 |
			a4 s2 |
			g4 s2 |

			\break

			a4 s2 |
			g4 s2 |
			e4 s2 |
			d4 s2 |
		}
	>>
}

mezzanine_four_a={
	\set Staff.connectArpeggios = ##t
	\guitarSetup
	\tempo 4=130
	\key d \major
	\time 3/4
	<<
		\new Voice { \voiceOne
			\mark \markup { \circle "A" }
			
			R2. |
			R2. |
			R2. |
			R2. |

			\break
			
			R2. |
			R2. |
			R2. |
			R2. |

			\break

			a2. |
			g2. |
			fis2. |
			e2. |

			\break

			\textSpannerUp
			\stringNumberSpanner "4"
			cis'2\startTextSpan b8 \tag #'print \glissando a( |
			b2) a8 \tag #'print \glissando g( |
			a2) g8 \tag #'print \glissando fis( |
			g2.)\stopTextSpan 

			\break

			a2. |
			g2. |
			fis2. |
			e2. |

			\break

			\textSpannerUp
			\stringNumberSpanner "4"
			cis'2\startTextSpan b8 \tag #'print \glissando a( |
			b2) a8 \tag #'print \glissando g( |
			a2) g8 \tag #'print \glissando fis( |
			g2.)\stopTextSpan 
		}
	>>
}
