// DetailsWindow.js
import React from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';

const DetailsWindow = ({ isVisible, onClose, responseDetails }) => {
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.heading}>Disease Details</Text>
                    {/* { <Text style={styles.detailsText}>{JSON.stringify(responseDetails, null, 2)}</Text> } */}
                    <Text style={styles.detailsText}>Disease:</Text>
                    {/* {responseDetails?.result?.disease?.suggestions[0]?.name} */}
                    {responseDetails?.result?.disease?.suggestions.map((suggestion, index) => (
                        <View key={index}>
                            <Text style={styles.detailsText}>Name: {suggestion.name}</Text>
                            <Text style={styles.detailsText}>Similar Images:</Text>
                            <View style={styles.imageContainer}>
                                {suggestion.similar_images.map((image, imageIndex) => (
                                    <Image key={imageIndex} source={{ uri: image.url }} style={styles.image} />
                                ))}
                            </View>
                        </View>
                    ))}
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 8,
  },
  image: {
    width: 90,
    height: 90,
    // flex: 
    // borderRadius: 5,
    // marginRight: 8,
  },
});

export default DetailsWindow;
