export function buildListOfDurationOptions(start = 30, max = 2880) {

    let list = [];

    for (let i = start; i <= max; i += 30) {

        let name = '';
        let hour = Math.floor(i / 60);
        let minutes = i % 60;
        if (hour === 1) {
            name = `${hour} hour `;
        } else if (hour > 1) {
            name = `${hour} hours `;
        }

        if (hour > 12 && hour % 12 > 0) {
            continue;
        }

        if (hour >= 24) {

            let days = Math.floor(hour / 24)
            name = `${days} days`;
            list.push({
                name: name,
                value: i,
            })
            i += 1410;//because we already have i+=30
            continue
        }

        if (hour >= 6) {

            if (minutes > 0) {
                continue
            }

            list.push({
                name: name,
                value: i,
            })
            continue
        }

        if (minutes > 0) {
            name += `${minutes} min`
        }

        list.push({
            name: name,
            value: i,
        })
    }

    return list;
}

