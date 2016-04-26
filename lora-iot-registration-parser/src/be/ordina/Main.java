package be.ordina;

import be.ordina.model.Entry;
import be.ordina.model.TimeStorage;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Main {

    public static void main(String[] args) {

        List<Entry> entries = new ArrayList<>();

        //Process entries:
        try {
            Files.list(new File("input/")
                    .toPath())
                    .forEach((path) -> {

                        TimeStorage ts = new TimeStorage();

                        try {
                            Files.lines(path).forEach(line -> {

                                if(line.startsWith("Time")) {
                                    //Indicates a new file!
                                    String[] pieces = path.getFileName().toString().split("_")[0].split("-");
                                    ts.year    = Integer.parseInt(pieces[0]);
                                    ts.month   = Integer.parseInt(pieces[1]) + 1;
                                    ts.date    = Integer.parseInt(pieces[2]);
                                } else {

                                    String[] pieces = line.split(",");
                                    String[] timePieces = pieces[0].split(":");
                                    int hours   = Integer.parseInt(timePieces[0]);
                                    int minutes = Integer.parseInt(timePieces[1]);
                                    int seconds = Integer.parseInt(timePieces[2]);

                                    LocalDateTime dateTime = LocalDateTime.of(ts.year, ts.month, ts.date, hours, minutes, seconds);
                                    //Correct for GMT+1 as we use the Brussels time! (in summer time this would be GMT+2)
                                    dateTime.atOffset(ZoneOffset.ofHours(1));
                                    String name = pieces[1];
                                    String email = pieces[2];
                                    String company = pieces[3];
                                    Boolean interested = Boolean.parseBoolean(pieces[4]);

                                    Entry entry = new Entry(dateTime, name, email, company, interested);
                                    entries.add(entry);
                                }
                            });
                        } catch (IOException e) {
                            System.out.println("Fail: " + e.getCause() + "\n" + e.getMessage());
                        }

                    });

        } catch (Exception e) {
            System.out.println("Fail: " + e.getCause() + "\n" + e.getMessage());
        }

        List<String> outputLines = new ArrayList<>();
        //Partition entries in two maps, ones where the email contains "ordina.be" and ones who do not.
        Map<Boolean, List<Entry>> emailTypes =
                entries .stream()
                        .parallel()
                        .collect(Collectors.partitioningBy(entry -> entry.getEmail().contains("@ordina.be")));

        for (Map.Entry<Boolean, List<Entry>> listEntry : emailTypes.entrySet()) {
            outputLines.add("========================================================");
            if(listEntry.getKey()) {
                outputLines.add("Ordina participants (" + listEntry.getValue().size() + ") :");
                outputLines.add("========================================================");
                outputLines.addAll(listEntry.getValue().stream().map(Entry::toString).collect(Collectors.toList()));
            } else {
                outputLines.add("Devoxx (non ordina) participants (" + listEntry.getValue().size() + ") :");
                outputLines.add("========================================================");

                Map<Boolean, List<Entry>> interestedTypes = listEntry.getValue().stream()
                                                                                .parallel()
                                                                                .collect(Collectors.partitioningBy(Entry::getIsInterestedInJob));

                for (Map.Entry<Boolean, List<Entry>> interestedEntries : interestedTypes.entrySet()) {
                    if(interestedEntries.getKey()) {
                        //Interested in a job:
                        outputLines.add("\n");
                        outputLines.add("///////////////////////////////////////");
                        outputLines.add("Interested in a job (" + interestedEntries.getValue().size() + ") :");
                        outputLines.add("///////////////////////////////////////");
                    } else {
                        outputLines.add("\n");
                        outputLines.add("///////////////////////////////////////");
                        outputLines.add("Not interested in a job (" + interestedEntries.getValue().size() + ") :");
                        outputLines.add("///////////////////////////////////////");
                    }

                    outputLines.addAll(interestedEntries.getValue().stream().map(Entry::toString).collect(Collectors.toList()));
                }
            }
            outputLines.add("\n\n");
        }

        //Write it all to file!
        try {
            if(!Files.exists(Paths.get("output/"))) {
                Files.createDirectory(Paths.get("output/"));
            }
            if(!Files.exists(Paths.get("output/output.txt"))) {
                Files.createFile(Paths.get("output/output.txt"));
            }

            Files.write(Paths.get("output/output.txt"), outputLines);
        } catch (IOException e) {
            System.out.println("Fail: " + e.getCause() + "\n" + e.getMessage());
        }
    }
}
