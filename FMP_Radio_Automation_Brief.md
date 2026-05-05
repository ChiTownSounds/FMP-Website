# FMP Radio - Automated Playlist Generation Brief

## System Context for AI Automation Agent
You are an AI automation agent tasked with generating commercial block playlists for a radio station. Please read the following inventory, schedule, and block generation rules, and output the required combinations for the automation software.

## 1. Station Identity & Format
* **Station Name:** FMP Radio
* **Format:** R&B and Soul
* **Location context:** Tarpon Springs, FL (Broadcasting with a Chicago market voice)
* **Goal:** Generate a master deck of unique commercial groupings that rotate predictably but avoid static time-slot repetition (Temporal Drift).

## 2. Asset Inventory
You have exactly 15 unique commercial audio files available:
* Five (5) x 30-second commercials
* Five (5) x 60-second commercials
* Five (5) x 90-second commercials

*Treat each file as a distinct, unique asset (e.g., 30A, 30B, 30C, 30D, 30E).*

## 3. Weekly Broadcast Schedule
The station runs on a 24/7 clock with three defined hour types:
* **Commercial Free (CF):** Features one 4-minute block backloaded at the end of the hour (:56).
* **Party Block (PB):** Features one 4-minute block either frontloaded at the start of the hour (:00) or backloaded at the end (:56).
* **Regular Schedule (RS):** Features two 2-minute blocks at (:15) and (:45).

### Hourly Matrix:
* **Weekdays (Mon-Fri):**
    * 06:00 - Commercial Free (:56)
    * 16:00 - Party Block Frontloaded (:00)
    * 17:00 - Party Block Backloaded (:56)
    * 22:00 - Commercial Free (:56)
    * All other 20 hours: Regular Schedule (:15 and :45)
* **Weekends (Sat-Sun):**
    * 08:00 - Party Block Frontloaded (:00)
    * 20:00 - Party Block Frontloaded (:00)
    * All other 22 hours: Regular Schedule (:15 and :45)

## 4. Playlist Generation Rules: The Master Decks
You must generate two separate "Master Decks" of commercial groupings. Order of files matters. 

### Deck A: 2-Minute Blocks (Total Required: 22 Unique Groupings)
* **Rule 1 (No 90s End):** No 2-minute grouping may end with a 90-second commercial.
* **Rule 2 (The Long Starters):** Exactly 10 of these groupings must start with a long commercial. Specifically, each of the five 60s and each of the five 90s must be used exactly once as the first commercial in a grouping. (Note: Since the block is 120 seconds, any block starting with a 90s MUST be followed immediately by a 30s to finish the block).
* **Rule 3 (The Remaining 12):** The remaining 12 groupings must be unique, must not start with a 90s, must not end with a 90s, and must total exactly 120 seconds. 

### Deck B: 4-Minute Blocks (Total Required: 20 Unique Groupings)
* **Rule 1 (Length):** The sequence must total exactly 240 seconds.
* **Rule 2 (No Double 90):** The grouping cannot contain more than one 90-second commercial.
* **Rule 3 (30-Second Bookends):** The sequence MUST start with a 30-second commercial AND end with a 30-second commercial.
* **Rule 4 (90-Second Buffer):** If a 90-second commercial is used, it MUST be immediately followed by a 30-second commercial.

## 5. Playback Logic (For Automation Configuration)
* **2-Minute Rotation:** Load the 22 unique 2-minute groupings into a sequential loop. Because there are 40 Regular Schedule blocks per weekday and 22 groupings, the starting block will naturally shift each day (Temporal Drift), ensuring the same grouping does not play at the same time on consecutive days.
* **4-Minute Rotation:** Load the 20 unique 4-minute groupings into a sequential loop. Because there are exactly twenty 4-minute blocks scheduled Monday through Friday, a listener will not hear a repeated 4-minute break for an entire work week. 
