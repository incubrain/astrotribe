We use UUID 1 Because it stores timestamps along with the file, we also want to discourage LOTs of
user generated content, we just want the premium content, which can be achived by restricting users
to 1 post per day.

### UUID Version 1 Details:

- **Timestamp-Based**: Incorporates the current time and date as part of the UUID itself, meaning
  that each UUID is not only unique but also time-ordered.
- **Structure**: Contains a 60-bit timestamp (the number of 100-nanosecond intervals since October
  15, 1582), a 14-bit clock sequence (for uniqueness if the clock is set backwards or if there are
  multiple UUIDs generated at the same timestamp), and a 48-bit node identifier (usually the MAC
  address of the machine generating the UUID).

### Benefits of Using UUID Version 1 for Images:

1. **Traceability**: Each image file can be traced back to its exact creation time from its UUID,
   without needing additional metadata fields.
2. **Sorting and Retrieval**: Images can be sorted or retrieved based on their creation times
   directly from their UUIDs, facilitating chronological organization and access.
3. **Scalability and Uniqueness**: Provides a high level of uniqueness and is suitable for
   distributed systems, ensuring that UUIDs generated from different machines at the same time are
   distinct.

### Example of UUID Version 1:

```javascript
import { v1 as uuidv1 } from 'uuid'

// Generate a UUID with embedded timestamp
const imageUUID = uuidv1()
console.log(imageUUID) // Outputs: '2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d'
```

### Usage for All Images:

If you choose UUID version 1 for all image types (avatars, posts, covers), you ensure consistency
across your file naming conventions and take full advantage of the built-in timestamp feature for
all your image-related assets.

In summary, UUID version 1 is an excellent choice for your scenario where timestamp information is
crucial, and it aligns well with your needs for both organizational and technical efficiency.
