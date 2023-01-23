public with sharing class PlaceController {
    @AuraEnabled(cacheable=true scope='global')
    public static Place__c[] getAllPlaces() {
        return [
            SELECT
                Id,
                Name,
                TicketPrice__c,
                Description__c,
                Email__c,
                ChildDiscount__c,
                StudentDiscount__c,
                FamilyDiscount__c,
                Type__c,
                Video__c,
                Images__c,
                Website__c,
                Location__Latitude__s,
                Location__Longitude__s,
                Supervisor__r.Name
            FROM Place__c
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT 50
        ];
    }

    @AuraEnabled(cacheable=true scope='global')
    public static Place__c[] searchPlaces(String searchTerm) {
        // Return all places when no search term
        searchTerm = searchTerm.trim();
        if (searchTerm == '') {
            return getAllPlaces();
        }
        // Prepare query paramters
        searchTerm = '%' + searchTerm + '%';
        // Execute search query
        return [
            SELECT
                Id,
                Name,
                TicketPrice__c,
                Description__c,
                Email__c,
                ChildDiscount__c,
                StudentDiscount__c,
                FamilyDiscount__c,
                Type__c,
                Video__c,
                Images__c,
                Website__c,
                Location__Latitude__s,
                Location__Longitude__s,
                Supervisor__r.Name
            FROM Place__c
            WHERE Name LIKE :searchTerm
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT 50
        ];
    }

    @AuraEnabled
    public static void sendEmail(Integer totalPrice, Integer numberOfTickets, String visitDate, String placeName) {
        // If we know how many addresses the email will be sent to from this transaction
        // We can set the reserve capacity
        Messaging.reserveSingleEmailCapacity(1);
 
        //We instantiate our single email message object
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
 
        // Strings to hold the email addresses to which you are sending the email.
        String recipient = UserInfo.getUserEmail();
        String[] toAddresses = new String[] {recipient};
        //Assign the TO address to our mail object
        mail.setToAddresses(toAddresses);
 
        // //List of ccAddress
        // String[] ccAddresses = new String[] {'wekone8076@mailvxin.net'};
        // // Assign the CC addresses
        // mail.setCcAddresses(ccAddresses);
 
        // Here we can set the address that will be used when a recipient replies to the email
        mail.setReplyTo(recipient);
 
        // Specify the name used as the display name.
        mail.setSenderDisplayName('Vienna Travel Buddy');
 
        // Set the subject line for your email address.
        mail.setSubject('Email Subject');
 
        // You can set this to true if you want to BCC yourself on the email
        mail.setBccSender(false);
 
        // You can specify your plain text here
        mail.setPlainTextBody('Sample plain text goes here');
 
        //Specify any html - for example this will display a link in the email
        mail.setHtmlBody('<!DOCTYPE html><html style="overflow-y: hidden;"><head><title></title><meta content="IE=edge"><meta content="text/html; charset=UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"></head><body style="word-spacing: normal; background-color: rgb(244, 244, 244); height: auto; min-height: auto;"><div style="background-color: rgb(244, 244, 244); text-align: center;"><img src="https://theleaflet.in/wp-content/uploads/2021/10/Reservation.jpg" style="width: 427px; height: 224px;" /></div><div id="" style="left: 300.6px; top: 8px;">&nbsp;</div><div id="" style="left: 300.6px; top: 8px; text-align: center;"><span style="font-size:28px;"><span style="font-family:Century Gothic,Arial,Helvetica,sans-serif;">Hi Mila Mirovic!</span></span><br /><span style="font-family:Century Gothic,Arial,Helvetica,sans-serif;"><span style="font-size:20px;">Your reservation is successfully created for ' + visitDate + '. We are expecting you soon at ' + placeName +'. You can get your tickets and pay for them on our main entrance. Number of tickets: ' + String.valueOf(numberOfTickets) + '. The total price is ' + String.valueOf(totalPrice) + ' €. Please show this email to our staff on entrance! &nbsp;</span></span></div></body></html>');
 
        // Send the email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
}
